export const PARTNER_CATEGORIES = ['advisory', 'finance', 'legal', 'technology'] as const;

export type PartnerCategory = (typeof PARTNER_CATEGORIES)[number];

/** Returns the public URL for a country's flag SVG. */
export function getCountryFlagUrl(isoCode: string): string {
  return `/flags/${isoCode.toLowerCase()}.svg`;
}
