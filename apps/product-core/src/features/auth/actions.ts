'use server';

import { logError } from '@kclub/observability';
import { redirect } from 'next/navigation';

import { createAdminClient } from '../../lib/supabase/admin';
import { prisma } from '../../lib/supabase/db';
import { createClient } from '../../lib/supabase/server';
import { getStripe } from '../../lib/stripe';
import { ensureActiveClubCard } from '../../server/club-card-service';

export async function signIn(prevState: { error: string } | null, formData: FormData) {
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;
  const locale = (formData.get('locale') as string) || 'en';

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ phone, password });

  if (error) {
    return { error: 'auth.errors.invalidCredentials' };
  }

  redirect(`/${locale}/dashboard`);
}

export async function signUp(prevState: { error: string } | null, formData: FormData) {
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const locale = (formData.get('locale') as string) || 'en';

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    phone,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName },
    },
  });

  if (error) {
    if (error.message?.includes('already registered')) {
      return { error: 'auth.errors.phoneExists' };
    }
    return { error: 'auth.errors.generic' };
  }

  if (data.user) {
    try {
      const member = await prisma.member.create({
        data: {
          supabaseUserId: data.user.id,
          phone,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          preferredLocale: locale,
        },
      });
      await ensureActiveClubCard(prisma)({ memberId: member.id, issuedAt: member.createdAt });
    } catch (memberError) {
      logError(memberError, {
        scope: 'product-core.auth.signUp',
        extra: { userId: data.user.id },
      });

      const adminClient = createAdminClient();
      if (adminClient) {
        const { error: deleteError } = await adminClient.auth.admin.deleteUser(data.user.id);
        if (deleteError) {
          logError(deleteError, {
            scope: 'product-core.auth.signUp.rollback',
            extra: { userId: data.user.id },
          });
        }
      } else {
        logError(new Error('SUPABASE_SERVICE_ROLE_KEY is not set'), {
          scope: 'product-core.auth.signUp.rollback',
          extra: { userId: data.user.id },
        });
      }

      return { error: 'auth.errors.generic' };
    }
  }

  redirect(`/${locale}/dashboard`);
}

export async function signOut(locale: string = 'en') {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}`);
}

export async function updateProfile(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'auth.errors.generic' };
  }

  try {
    await prisma.member.update({
      where: { supabaseUserId: user.id },
      data: {
        firstName: (formData.get('firstName') as string).trim(),
        lastName: (formData.get('lastName') as string).trim(),
        displayName: (formData.get('displayName') as string)?.trim() || null,
        company: (formData.get('company') as string)?.trim() || null,
        position: (formData.get('position') as string)?.trim() || null,
        bio: (formData.get('bio') as string)?.trim() || null,
        city: (formData.get('city') as string)?.trim() || null,
        country: (formData.get('country') as string)?.trim() || null,
      },
    });
  } catch (error) {
    logError(error, { scope: 'product-core.auth.updateProfile', extra: { userId: user.id } });
    return { error: 'auth.errors.generic' };
  }

  return { success: true };
}

export async function submitMembershipApplication(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'auth.errors.generic' };
  }

  try {
    const member = await prisma.member.findUnique({
      where: { supabaseUserId: user.id },
    });

    if (!member) {
      return { error: 'auth.errors.generic' };
    }

    await prisma.membershipApplication.create({
      data: {
        memberId: member.id,
        motivation: (formData.get('motivation') as string)?.trim() || null,
        referralSource: (formData.get('referralSource') as string)?.trim() || null,
      },
    });
  } catch (error) {
    logError(error, { scope: 'product-core.auth.submitMembershipApplication', extra: { userId: user.id } });
    return { error: 'auth.errors.generic' };
  }

  return { success: true };
}

export async function changePassword(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData,
) {
  const newPassword = formData.get('newPassword') as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { error: 'auth.errors.generic' };
  }

  return { success: true };
}

export async function startVipCheckout(formData: FormData) {
  const locale = (formData.get('locale') as string) || 'en';
  const priceId = process.env.STRIPE_VIP_PRICE_ID;
  const publicUrl = process.env.PRODUCT_CORE_PUBLIC_URL ?? 'http://localhost:3000';

  if (!priceId) {
    redirect(`/${locale}/dashboard?checkout=vip-unavailable`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${publicUrl}/${locale}/dashboard?checkout=vip-success`,
    cancel_url: `${publicUrl}/${locale}/dashboard?checkout=vip-cancel`,
    metadata: {
      supabaseUserId: user.id,
      product: 'vip_membership',
    },
  });

  if (!session.url) {
    redirect(`/${locale}/dashboard?checkout=vip-unavailable`);
  }

  redirect(session.url);
}
