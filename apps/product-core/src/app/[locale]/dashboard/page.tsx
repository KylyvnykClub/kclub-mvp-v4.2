import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound, redirect } from 'next/navigation';

import { routing } from '../../../i18n/routing';
import { createClient } from '../../../lib/supabase/server';
import { prisma } from '../../../lib/supabase/db';
import { DashboardHome } from '../../../features/dashboard/components/DashboardHome';
import type { MembershipApplicationStatus } from '@kclub/domain';

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: DashboardPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dashboard.overview' });

  return { title: t('title') };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
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

  const memberName = member.displayName || member.firstName;
  const applicationStatus = member.membershipApplication?.status as MembershipApplicationStatus | undefined;

  return (
    <DashboardHome
      memberName={memberName}
      applicationStatus={applicationStatus ?? null}
    />
  );
}
