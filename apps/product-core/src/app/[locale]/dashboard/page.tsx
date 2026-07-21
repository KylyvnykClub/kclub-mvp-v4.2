import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound, redirect } from 'next/navigation';
import QRCode from 'qrcode';

import { routing } from '../../../i18n/routing';
import { createClient } from '../../../lib/supabase/server';
import { prisma } from '../../../lib/supabase/db';
import { DashboardHome } from '../../../features/dashboard/components/DashboardHome';
import { ensureActiveClubCard } from '../../../server/club-card-service';
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const member = await prisma.member.findUnique({
    where: { supabaseUserId: user.id },
    include: {
      clubCards: {
        where: { status: 'ACTIVE' },
        orderBy: { issuedAt: 'desc' },
        take: 1,
      },
      membershipApplication: true,
    },
  });

  if (!member) {
    redirect(`/${locale}/auth/login`);
  }

  const memberName = member.displayName || member.firstName;
  const applicationStatus = member.membershipApplication?.status as
    MembershipApplicationStatus | undefined;
  const activeCard =
    member.clubCards[0] ??
    (await ensureActiveClubCard(prisma)({ memberId: member.id, issuedAt: member.createdAt }));
  const cardPublicId =
    activeCard.publicId || member.id.replaceAll('-', '').slice(0, 8).toUpperCase();
  const publicUrl = process.env.PRODUCT_CORE_PUBLIC_URL ?? 'http://localhost:3000';
  const verificationUrl = `${publicUrl}/${locale}/verify-card/${cardPublicId}`;
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    margin: 1,
    width: 128,
  });

  return (
    <DashboardHome
      locale={locale}
      memberName={memberName}
      member={{
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        displayName: member.displayName,
        phone: member.phone,
        country: member.country,
        city: member.city,
        preferredLocale: member.preferredLocale,
        createdAt: member.createdAt,
      }}
      card={{
        publicId: cardPublicId,
        expiresAt: activeCard.expiresAt,
        qrCodeDataUrl,
      }}
      applicationStatus={applicationStatus ?? null}
    />
  );
}
