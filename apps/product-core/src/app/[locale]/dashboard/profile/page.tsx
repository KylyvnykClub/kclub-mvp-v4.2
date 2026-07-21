import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound, redirect } from 'next/navigation';

import { routing } from '../../../../i18n/routing';
import { createClient } from '../../../../lib/supabase/server';
import { prisma } from '../../../../lib/supabase/db';
import { ProfilePage } from '../../../../features/dashboard/components/ProfilePage';

type ProfileRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ProfileRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dashboard.profile' });

  return { title: t('title') };
}

export default async function ProfileRoute({ params }: ProfileRouteProps) {
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
  });

  if (!member) {
    redirect(`/${locale}/auth/login`);
  }

  const themeT = await getTranslations({ locale, namespace: 'home.theme' });

  return (
    <ProfilePage
      locale={locale}
      themeLabels={{
        label: themeT('label'),
        system: themeT('system'),
        light: themeT('light'),
        dark: themeT('dark'),
      }}
      member={{
        firstName: member.firstName,
        lastName: member.lastName,
        displayName: member.displayName,
        company: member.company,
        position: member.position,
        bio: member.bio,
        city: member.city,
        country: member.country,
        phone: member.phone,
      }}
    />
  );
}
