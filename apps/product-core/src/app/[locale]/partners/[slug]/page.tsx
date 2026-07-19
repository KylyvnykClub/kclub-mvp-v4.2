import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { PartnerDetailPage } from '../../../../features/partners/PartnerDetailPage';
import { findPartnerBySlug, PARTNERS } from '../../../../features/partners/data';
import { routing } from '../../../../i18n/routing';

type PartnerRouteProps = Readonly<{
  params: Promise<{ locale: string; slug: string }>;
}>;

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PARTNERS.map((partner) => ({ locale, slug: partner.slug })),
  );
}

export async function generateMetadata({ params }: PartnerRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const partner = findPartnerBySlug(slug);
  if (!partner) notFound();

  const t = await getTranslations({ locale, namespace: 'partners' });
  const name = t(`items.${partner.key}.name`);
  const description = t(`items.${partner.key}.description`);
  const path = `/${locale}/partners/${slug}`;

  return {
    title: name,
    description,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}/partners/${slug}`]),
      ),
    },
    openGraph: { title: name, description, url: path },
  };
}

export default async function PartnerRoute({ params }: PartnerRouteProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const partner = findPartnerBySlug(slug);
  if (!partner) notFound();

  return <PartnerDetailPage partner={partner} />;
}
