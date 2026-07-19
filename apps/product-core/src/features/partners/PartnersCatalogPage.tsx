import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Link } from '../../i18n/navigation';
import { filterPartners, paginatePartners, type PartnerFilters } from './catalog';
import { PARTNER_CATEGORIES, PARTNER_COUNTRIES, PARTNERS } from './data';
import { PartnerCard } from './PartnerCard';

const buildCatalogHref = (filters: PartnerFilters, page: number) => {
  const params = new URLSearchParams();

  if (filters.category) params.set('category', filters.category);
  if (filters.country) params.set('country', filters.country);
  if (filters.minimumDiscount) params.set('discount', String(filters.minimumDiscount));
  if (page > 1) params.set('page', String(page));

  const query = params.toString();
  return query ? `/partners?${query}` : '/partners';
};

type PartnersCatalogPageProps = Readonly<{
  filters: PartnerFilters;
}>;

export async function PartnersCatalogPage({ filters }: PartnersCatalogPageProps) {
  const t = await getTranslations('partners');
  const filtered = filterPartners(PARTNERS, filters);
  const pagination = paginatePartners(filtered, filters.page);

  return (
    <main className="kc-partners-page">
      <section className="kc-partners-hero">
        <div className="kc-container">
          <p className="kc-eyebrow">{t('hero.eyebrow')}</p>
          <h1 id="partners-page-title">{t('hero.title')}</h1>
          <p>{t('hero.lead')}</p>
        </div>
      </section>

      <section className="kc-section kc-partners-catalog" aria-label={t('results.title')}>
        <div className="kc-container kc-partners-layout">
          <nav className="kc-breadcrumbs" aria-label={t('breadcrumbs.label')}>
            <ol>
              <li>
                <Link className="kc-focus-ring" href="/">
                  {t('breadcrumbs.home')}
                </Link>
              </li>
              <li aria-current="page">{t('breadcrumbs.partners')}</li>
            </ol>
          </nav>

          <aside className="kc-partners-filters" aria-labelledby="partners-filters-title">
            <div className="kc-partners-filter-title">
              <SlidersHorizontal aria-hidden="true" />
              <h2 id="partners-filters-title">{t('filters.title')}</h2>
            </div>
            <form className="kc-partners-filter-form" method="get">
              <label className="kc-field">
                <span className="kc-label">{t('filters.category')}</span>
                <select className="kc-input" defaultValue={filters.category ?? ''} name="category">
                  <option value="">{t('filters.allCategories')}</option>
                  {PARTNER_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {t(`categories.${category}`)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="kc-field">
                <span className="kc-label">{t('filters.country')}</span>
                <select className="kc-input" defaultValue={filters.country ?? ''} name="country">
                  <option value="">{t('filters.allCountries')}</option>
                  {PARTNER_COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {t(`countries.${country}`)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="kc-field">
                <span className="kc-label">{t('filters.discount')}</span>
                <select
                  className="kc-input"
                  defaultValue={filters.minimumDiscount ? String(filters.minimumDiscount) : ''}
                  name="discount"
                >
                  <option value="">{t('filters.anyDiscount')}</option>
                  {[10, 15, 20].map((discount) => (
                    <option key={discount} value={discount}>
                      {t('filters.discountFrom', { discount })}
                    </option>
                  ))}
                </select>
              </label>
              <div className="kc-partners-filter-actions">
                <button className="kc-button kc-focus-ring" type="submit">
                  {t('filters.apply')}
                </button>
                <Link className="kc-button kc-focus-ring" data-tone="ghost" href="/partners">
                  {t('filters.reset')}
                </Link>
              </div>
            </form>
          </aside>

          <div className="kc-partners-results">
            {pagination.items.length ? (
              <div className="kc-partners-directory-grid">
                {pagination.items.map((partner) => (
                  <PartnerCard
                    key={partner.key}
                    image={partner.image}
                    name={t(`items.${partner.key}.name`)}
                    description={t(`items.${partner.key}.description`)}
                    category={t(`categories.${partner.category}`)}
                    country={partner.country}
                    countryLabel={t(`countries.${partner.country}`)}
                    discountText={t('card.discount', {
                      discount: partner.discountPercent,
                    })}
                    detailsLabel={t('card.details')}
                    href="#contact"
                  />
                ))}
              </div>
            ) : (
              <div className="kc-partners-empty">
                <h3>{t('empty.title')}</h3>
                <p>{t('empty.text')}</p>
                <Link className="kc-button kc-focus-ring" href="/partners">
                  {t('filters.reset')}
                </Link>
              </div>
            )}

            {pagination.pageCount > 1 ? (
              <nav className="kc-pagination" aria-label={t('pagination.label')}>
                <Link
                  aria-disabled={pagination.currentPage === 1}
                  className="kc-button kc-focus-ring"
                  data-tone="ghost"
                  href={buildCatalogHref(filters, pagination.currentPage - 1)}
                  tabIndex={pagination.currentPage === 1 ? -1 : undefined}
                >
                  <ChevronLeft aria-hidden="true" />
                  {t('pagination.previous')}
                </Link>
                <span>
                  {t('pagination.status', {
                    current: pagination.currentPage,
                    total: pagination.pageCount,
                  })}
                </span>
                <Link
                  aria-disabled={pagination.currentPage === pagination.pageCount}
                  className="kc-button kc-focus-ring"
                  data-tone="ghost"
                  href={buildCatalogHref(filters, pagination.currentPage + 1)}
                  tabIndex={pagination.currentPage === pagination.pageCount ? -1 : undefined}
                >
                  {t('pagination.next')}
                  <ChevronRight aria-hidden="true" />
                </Link>
              </nav>
            ) : null}
          </div>
        </div>
      </section>

      <section className="kc-section kc-partners-contact" id="contact">
        <div className="kc-container">
          <p className="kc-eyebrow">{t('contact.eyebrow')}</p>
          <h2>{t('contact.title')}</h2>
          <p>{t('contact.lead')}</p>
          <Link className="kc-button kc-focus-ring" href="/#contact">
            {t('contact.action')}
          </Link>
        </div>
      </section>
    </main>
  );
}
