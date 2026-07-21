import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { routing } from '../../../../i18n/routing';

type BusinessRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: BusinessRouteProps): Promise<Metadata> {
  const { locale } = await params;

  return { title: locale === 'ru' ? 'Business' : 'Business' };
}

export default async function BusinessRoute({ params }: BusinessRouteProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'dashboard.overview' });

  return (
    <div className="kc-dashboard-page">
      <div className="kc-dashboard-page-header">
        <h1 className="kc-dashboard-page-title">Business</h1>
        <p className="kc-dashboard-page-lead">{t('statusApproved')}</p>
      </div>

      <div className="kc-business-panel">
        <span className="kc-badge">APPROVED</span>
        <h2>KYLYVNYK CLUB Business</h2>
        <p>{t('links.membership.desc')}</p>
      </div>
    </div>
  );
}
