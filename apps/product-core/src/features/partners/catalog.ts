import type { PartnerCategory, PartnerCountry, PartnerProfile } from './data';

export const PARTNERS_PER_PAGE = 6;

export type PartnerFilters = Readonly<{
  category?: PartnerCategory;
  country?: PartnerCountry;
  minimumDiscount?: number;
  page: number;
}>;

export const filterPartners = (
  partners: ReadonlyArray<PartnerProfile>,
  filters: PartnerFilters,
): ReadonlyArray<PartnerProfile> =>
  partners.filter(
    (partner) =>
      (!filters.category || partner.category === filters.category) &&
      (!filters.country || partner.country === filters.country) &&
      (!filters.minimumDiscount || partner.discountPercent >= filters.minimumDiscount),
  );

export const paginatePartners = (
  partners: ReadonlyArray<PartnerProfile>,
  page: number,
  perPage = PARTNERS_PER_PAGE,
) => {
  const pageCount = Math.max(1, Math.ceil(partners.length / perPage));
  const currentPage = Math.min(Math.max(1, page), pageCount);
  const start = (currentPage - 1) * perPage;

  return {
    currentPage,
    pageCount,
    items: partners.slice(start, start + perPage),
  } as const;
};
