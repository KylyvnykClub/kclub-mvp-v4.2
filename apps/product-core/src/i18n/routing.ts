import { defineRouting } from 'next-intl/routing';

/**
 * Central locale-routing configuration (ADR-010).
 *
 * Locales are locale-prefixed with `localePrefix: 'always'`, so the bare `/`
 * is redirected to the default locale by the proxy.
 */
export const routing = defineRouting({
  locales: ['en', 'ru', 'uk'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export type AppLocale = (typeof routing.locales)[number];
