import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { PartnerDetailPage } from '../../../../features/partners/PartnerDetailPage';
import { getPartnerBySlug } from '../../../../features/partners/repository';
import { routing } from '../../../../i18n/routing';

export const revalidate = 300;

type PartnerRouteProps = Readonly<{
  params: Promise<{ locale: string; slug: string }>;
}>;

export async function generateMetadata({ params }: PartnerRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const partner = await getPartnerBySlug(slug, locale);
  if (!partner) notFound();

  const t = await getTranslations({ locale, namespace: 'partners' });
  const path = `/${locale}/partners/${slug}`;

  return {
    title: partner.name,
    description: partner.description,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}/partners/${slug}`]),
      ),
    },
    openGraph: { title: partner.name, description: partner.description, url: path },
  };
}

export default async function PartnerRoute({ params }: PartnerRouteProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const partner = await getPartnerBySlug(slug, locale);
  if (!partner) notFound();

  return <PartnerDetailPage partner={partner} />;
}
