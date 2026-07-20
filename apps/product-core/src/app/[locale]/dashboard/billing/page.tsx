import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { routing } from '../../../../i18n/routing';
import { BillingPage } from '../../../../features/dashboard/components/BillingPage';

type BillingRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: BillingRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dashboard.billing' });

  return { title: t('title') };
}

export default async function BillingRoute({ params }: BillingRouteProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return <BillingPage />;
}
