import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { AboutPage } from '../../../features/about/components/AboutPage';
import { routing } from '../../../i18n/routing';

type AboutRouteProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: AboutRouteProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'about.meta' });
  const path = `/${locale}/about`;

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: path,
      languages: {
        en: '/en/about',
        ru: '/ru/about',
        uk: '/uk/about',
        'x-default': '/en/about',
      },
    },
    openGraph: { title: t('title'), description: t('description'), url: path },
  };
}

export default async function AboutRoute({ params }: AboutRouteProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return <AboutPage />;
}
