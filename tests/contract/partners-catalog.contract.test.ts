import { describe, expect, it } from 'vitest';

import {
  filterPartners,
  paginatePartners,
} from '../../apps/product-core/src/features/partners/catalog';
import { PARTNERS } from '../../apps/product-core/src/features/partners/data';

describe('partners catalog', () => {
  it('combines category, country, and minimum-discount filters', () => {
    const result = filterPartners(PARTNERS, {
      category: 'technology',
      country: 'ukraine',
      minimumDiscount: 20,
      page: 1,
    });

    expect(result.map((partner) => partner.key)).toEqual(['vectorLabs', 'dniproDigital']);
  });

  it('paginates results and clamps invalid page numbers', () => {
    const firstPage = paginatePartners(PARTNERS, 1, 6);
    const finalPage = paginatePartners(PARTNERS, 99, 6);

    expect(firstPage.items).toHaveLength(6);
    expect(firstPage.pageCount).toBe(2);
    expect(finalPage.currentPage).toBe(2);
    expect(finalPage.items).toHaveLength(3);
  });
});
