export const PARTNER_CATEGORIES = ['advisory', 'finance', 'legal', 'technology'] as const;
export const PARTNER_COUNTRIES = ['germany', 'switzerland', 'poland', 'ukraine'] as const;

export type PartnerCategory = (typeof PARTNER_CATEGORIES)[number];
export type PartnerCountry = (typeof PARTNER_COUNTRIES)[number];

export type PartnerProfile = Readonly<{
  key: string;
  slug: string;
  category: PartnerCategory;
  country: PartnerCountry;
  discountPercent: number;
  image: string;
}>;

export const PARTNERS: ReadonlyArray<PartnerProfile> = [
  {
    key: 'northHarbor',
    slug: 'north-harbor-advisors',
    category: 'advisory',
    country: 'germany',
    discountPercent: 15,
    image:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format&fit=crop&q=85',
  },
  {
    key: 'meridian',
    slug: 'meridian-family-office',
    category: 'finance',
    country: 'switzerland',
    discountPercent: 10,
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop&q=85',
  },
  {
    key: 'loden',
    slug: 'loden-legal',
    category: 'legal',
    country: 'poland',
    discountPercent: 20,
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=85',
  },
  {
    key: 'vectorLabs',
    slug: 'vector-labs',
    category: 'technology',
    country: 'ukraine',
    discountPercent: 25,
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&auto=format&fit=crop&q=85',
  },
  {
    key: 'steinWorks',
    slug: 'stein-works',
    category: 'advisory',
    country: 'switzerland',
    discountPercent: 10,
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=85',
  },
  {
    key: 'vistulaCapital',
    slug: 'vistula-capital',
    category: 'finance',
    country: 'poland',
    discountPercent: 15,
    image:
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&auto=format&fit=crop&q=85',
  },
  {
    key: 'dniproDigital',
    slug: 'dnipro-digital',
    category: 'technology',
    country: 'ukraine',
    discountPercent: 20,
    image:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&auto=format&fit=crop&q=85',
  },
  {
    key: 'rheinLegal',
    slug: 'rhein-legal',
    category: 'legal',
    country: 'germany',
    discountPercent: 10,
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=85',
  },
  {
    key: 'alpineStrategy',
    slug: 'alpine-strategy',
    category: 'advisory',
    country: 'switzerland',
    discountPercent: 5,
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&auto=format&fit=crop&q=85',
  },
] as const;

export const findPartnerBySlug = (slug: string) =>
  PARTNERS.find((p) => p.slug === slug);
