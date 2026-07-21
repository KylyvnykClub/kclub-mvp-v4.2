import 'server-only';

import type { PartnerCategory } from './data';
import { getCountryName } from './countries';
import { getDatabase } from '../../server/database';

export type PartnerPublic = Readonly<{
  slug: string;
  category: PartnerCategory;
  country: string;
  countryName: string;
  discountPercent: number;
  image: string;
  name: string;
  description: string;
}>;

type DbPartnerCategory = 'ADVISORY' | 'FINANCE' | 'LEGAL' | 'TECHNOLOGY';

const CATEGORY_MAP: Record<DbPartnerCategory, PartnerCategory> = {
  ADVISORY: 'advisory',
  FINANCE: 'finance',
  LEGAL: 'legal',
  TECHNOLOGY: 'technology',
};

type PartnerTranslations = Record<string, { name: string; description: string } | undefined>;

const resolveTranslation = (
  translations: PartnerTranslations,
  locale: string,
): { name: string; description: string } => {
  const entry = translations[locale] ?? translations['en'];
  return {
    name: entry?.name ?? '',
    description: entry?.description ?? '',
  };
};

export async function listPartners(locale: string): Promise<readonly PartnerPublic[]> {
  const db = getDatabase();
  const rows = await db.partner.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
  return rows.map((row) => {
    const { name, description } = resolveTranslation(row.translations as PartnerTranslations, locale);
    return {
      slug: row.slug,
      category: CATEGORY_MAP[row.category as DbPartnerCategory],
      country: row.country,
      countryName: getCountryName(row.country) ?? row.country.toUpperCase(),
      discountPercent: row.discountPercent,
      image: row.image,
      name,
      description,
    };
  });
}

export async function getPartnerBySlug(
  slug: string,
  locale: string,
): Promise<PartnerPublic | null> {
  const db = getDatabase();
  const row = await db.partner.findUnique({
    where: { slug, isActive: true },
  });
  if (row === null) return null;
  const { name, description } = resolveTranslation(row.translations as PartnerTranslations, locale);
  return {
    slug: row.slug,
    category: CATEGORY_MAP[row.category as DbPartnerCategory],
    country: row.country,
    countryName: getCountryName(row.country) ?? row.country.toUpperCase(),
    discountPercent: row.discountPercent,
    image: row.image,
    name,
    description,
  };
}

export async function listPartnerSlugs(): Promise<readonly string[]> {
  const db = getDatabase();
  const rows = await db.partner.findMany({
    where: { isActive: true },
    select: { slug: true },
    orderBy: { sortOrder: 'asc' },
  });
  return rows.map((r) => r.slug);
}
