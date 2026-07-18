# Stripe Billing

## Ownership

Stripe is the financial source of truth. Product-core owns Stripe SDK usage, Checkout/portal creation, webhook verification, billing commands, entitlement projection, reconciliation, and audit events. Admin-app requests typed product-core billing APIs only; it never calls Stripe with secret credentials.

## Lifecycle

1. Product-core creates a Stripe Checkout or billing portal session with an idempotency key.
2. Stripe completes payment asynchronously.
3. Product-core receives the signed raw-body webhook.
4. It records the Stripe event ID before processing, rejects duplicates safely, and projects subscription/payment/entitlement state transactionally.
5. It emits notifications and audit events after durable state succeeds.
6. A scheduled reconciliation compares active subscriptions and recent invoices with Stripe to repair missed or delayed events.

The browser success page is confirmation UX only. It never grants VIP access. Grant, revoke, refund, and cancellation decisions are based on verified webhook and reconciliation state.

## Required records

Persist Stripe customer/subscription/invoice/payment identifiers, money in integer minor units, ISO currency, status, event receipt/processing state, safe failure reason, and timestamps. Store Stripe webhook payloads only when justified by retention and privacy policy; never store card details.

## Webhook rules

- Verify `stripe-signature` with the raw unparsed body and endpoint secret.
- Treat delivery as at-least-once and potentially out of order.
- Deduplicate by Stripe event ID and protect outgoing Stripe mutations with idempotency keys.
- Make processing retryable, observable, and dead-lettered after a bounded failure policy.
- Test duplicate, delayed, invalid-signature, failed, refunded, canceled, and out-of-order scenarios.
