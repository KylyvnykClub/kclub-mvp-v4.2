import { getDatabase } from '../../../../server/database';
import { getStripe } from '../../../../lib/stripe';
import type Stripe from 'stripe';

const mapStripeStatus = (status: Stripe.Subscription.Status): 'NONE' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED' => {
  switch (status) {
    case 'active':
    case 'trialing':
      return 'ACTIVE';
    case 'past_due':
    case 'unpaid':
      return 'PAST_DUE';
    case 'canceled':
      return 'CANCELED';
    case 'incomplete_expired':
      return 'EXPIRED';
    default:
      return 'NONE';
  }
};

export const POST = async (request: Request): Promise<Response> => {
  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response('Stripe webhook secret is not configured', { status: 500 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    return new Response(`Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`, { status: 400 });
  }

  const db = getDatabase();

  try {
    // Check for duplicate event (idempotency)
    const existingEvent = await db.stripeWebhookEvent.findUnique({
      where: { stripeEventId: event.id },
    });

    if (existingEvent?.processedAt) {
      return new Response('Event already processed', { status: 200 });
    }

    if (!existingEvent) {
      await db.stripeWebhookEvent.create({
        data: {
          stripeEventId: event.id,
          type: event.type,
          payload: event as any,
        },
      });
    }

    await db.$transaction(async (tx) => {
      // Process specific events
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const partnerId = session.client_reference_id;

        if (partnerId) {
          await tx.partner.updateMany({
            where: { id: partnerId },
            data: {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              subscriptionStatus: 'ACTIVE', // Assumed active immediately on checkout complete
            },
          });
        }
      } else if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
        const subscription = event.data.object as any;
        const priceId = subscription.items?.data?.[0]?.price?.id;
        const currentPeriodStart = new Date(subscription.current_period_start * 1000);
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

        await tx.partner.updateMany({
          where: {
            OR: [
              { stripeSubscriptionId: subscription.id },
              { stripeCustomerId: subscription.customer as string },
            ],
          },
          data: {
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: mapStripeStatus(subscription.status),
            stripePriceId: priceId ?? null,
            currentPeriodStart,
            currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });
      } else if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as any;
        await tx.partner.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            subscriptionStatus: subscription.current_period_end * 1000 < Date.now() ? 'EXPIRED' : 'CANCELED',
          },
        });
      } else if (event.type === 'invoice.payment_failed') {
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          await tx.partner.updateMany({
            where: { stripeSubscriptionId: invoice.subscription as string },
            data: {
              subscriptionStatus: 'PAST_DUE',
            },
          });
        }
      }

      // Mark event as processed
      await tx.stripeWebhookEvent.update({
        where: { stripeEventId: event.id },
        data: { processedAt: new Date() },
      });
    });

    return new Response('Success', { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
