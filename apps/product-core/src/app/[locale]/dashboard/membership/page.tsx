import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound, redirect } from 'next/navigation';

import { routing } from '../../../../i18n/routing';
import { createClient } from '../../../../lib/supabase/server';
import { prisma } from '../../../../lib/supabase/db';
import { MembershipPage } from '../../../../features/dashboard/components/MembershipPage';
import type { MembershipApplicationStatus } from '@kclub/domain';

type MembershipRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MembershipRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dashboard.membership' });

  return { title: t('title') };
}

export default async function MembershipRoute({ params }: MembershipRouteProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const member = await prisma.member.findUnique({
    where: { supabaseUserId: user.id },
    include: { membershipApplication: true },
  });

  if (!member) {
    redirect(`/${locale}/auth/login`);
  }

  const application = member.membershipApplication
    ? {
        status: member.membershipApplication.status as MembershipApplicationStatus,
        motivation: member.membershipApplication.motivation,
        referralSource: member.membershipApplication.referralSource,
        submittedAt: (member.membershipApplication as any).submittedAt ?? new Date(),
        reviewNote: (member.membershipApplication as any).reviewNote ?? null,
      }
    : null;

  return <MembershipPage application={application} />;
}
