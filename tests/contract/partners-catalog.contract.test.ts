import { describe, expect, it } from 'vitest';

import {
  filterPartners,
  paginatePartners,
} from '../../apps/product-core/src/features/partners/catalog';

const fixture = [
  { key: 'a', slug: 'north-harbor-advisors', category: 'advisory' as const, country: 'germany' as const, discountPercent: 15, image: '' },
  { key: 'b', slug: 'meridian-family-office', category: 'finance' as const, country: 'switzerland' as const, discountPercent: 10, image: '' },
  { key: 'c', slug: 'loden-legal', category: 'legal' as const, country: 'poland' as const, discountPercent: 20, image: '' },
  { key: 'd', slug: 'vector-labs', category: 'technology' as const, country: 'ukraine' as const, discountPercent: 25, image: '' },
  { key: 'e', slug: 'stein-works', category: 'advisory' as const, country: 'switzerland' as const, discountPercent: 10, image: '' },
  { key: 'f', slug: 'vistula-capital', category: 'finance' as const, country: 'poland' as const, discountPercent: 15, image: '' },
  { key: 'g', slug: 'dnipro-digital', category: 'technology' as const, country: 'ukraine' as const, discountPercent: 20, image: '' },
  { key: 'h', slug: 'rhein-legal', category: 'legal' as const, country: 'germany' as const, discountPercent: 10, image: '' },
  { key: 'i', slug: 'alpine-strategy', category: 'advisory' as const, country: 'switzerland' as const, discountPercent: 5, image: '' },
];

describe('partners catalog', () => {
  it('combines category, country, and minimum-discount filters', () => {
    const result = filterPartners(fixture, {
      category: 'technology',
      country: 'ukraine',
      minimumDiscount: 20,
      page: 1,
    });

    expect(result.map((partner) => partner.key)).toEqual(['d', 'g']);
  });

  it('paginates results and clamps invalid page numbers', () => {
    const firstPage = paginatePartners(fixture, 1, 6);
    const finalPage = paginatePartners(fixture, 99, 6);

    expect(firstPage.items).toHaveLength(6);
    expect(firstPage.pageCount).toBe(2);
    expect(finalPage.currentPage).toBe(2);
    expect(finalPage.items).toHaveLength(3);
  });
});
