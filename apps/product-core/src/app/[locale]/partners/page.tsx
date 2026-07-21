import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { PartnersCatalogPage } from '../../../features/partners/PartnersCatalogPage';
import {
  PARTNER_CATEGORIES,
  type PartnerCategory,
} from '../../../features/partners/data';
import { listPartners } from '../../../features/partners/repository';
import { routing } from '../../../i18n/routing';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type PartnersRouteProps = Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}>;

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const parsePositiveInteger = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const isCategory = (value: string | undefined): value is PartnerCategory =>
  PARTNER_CATEGORIES.some((category) => category === value);

const isCountry = (value: string | undefined): value is string =>
  typeof value === 'string' && value.length > 0;

export async function generateMetadata({ params }: PartnersRouteProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'partners.meta' });
  const path = `/${locale}/partners`;

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: path,
      languages: {
        en: '/en/partners',
        ru: '/ru/partners',
        uk: '/uk/partners',
        'x-default': '/en/partners',
      },
    },
    openGraph: { title: t('title'), description: t('description'), url: path },
  };
}

export default async function PartnersRoute({ params, searchParams }: PartnersRouteProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const query = await searchParams;
  const category = firstValue(query.category);
  const country = firstValue(query.country);
  const discount = parsePositiveInteger(firstValue(query.discount), 0);
  const page = parsePositiveInteger(firstValue(query.page), 1);

  const partners = await listPartners(locale);

  return (
    <PartnersCatalogPage
      partners={partners}
      locale={locale}
      filters={{
        ...(isCategory(category) ? { category } : {}),
        ...(isCountry(country) ? { country } : {}),
        ...(discount ? { minimumDiscount: discount } : {}),
        page,
      }}
    />
  );
}
