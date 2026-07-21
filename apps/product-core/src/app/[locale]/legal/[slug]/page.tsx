import { notFound } from 'next/navigation';

import { LegalDocument } from '../../../../features/legal/components/LegalDocument';
import { routing, AppLocale } from '../../../../i18n/routing';

import { legalDocRegistry, legalSlugs } from '../../../../features/legal/content';

export function generateStaticParams() {
  return legalSlugs.map((slug: string) => ({ slug }));
}

export default async function LegalPage(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await props.params;

  if (!routing.locales.includes(locale as AppLocale)) {
    notFound();
  }

  const doc = legalDocRegistry[slug];
  if (!doc) {
    notFound();
  }

  const localizedDoc = doc[locale as AppLocale];
  if (!localizedDoc) {
    notFound();
  }

  return <LegalDocument doc={localizedDoc} />;
}
