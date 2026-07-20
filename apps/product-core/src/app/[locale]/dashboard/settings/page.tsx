import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { routing } from '../../../../i18n/routing';
import { SettingsPage } from '../../../../features/dashboard/components/SettingsPage';

type SettingsRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SettingsRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dashboard.settings' });

  return { title: t('title') };
}

export default async function SettingsRoute({ params }: SettingsRouteProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'home.theme' });

  return (
    <SettingsPage
      locale={locale}
      themeLabels={{
        label: t('label'),
        system: t('system'),
        light: t('light'),
        dark: t('dark'),
      }}
    />
  );
}
