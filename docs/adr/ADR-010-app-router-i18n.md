# ADR-010: App Router Internationalization with next-intl

Status: Accepted

## Context

ADR-005 establishes that Directus owns translations, public page copy, SEO metadata, and FAQ. SEO.md requires locale-prefixed routes (`/en`, `/ru`, `/uk`), hreflang alternates (including `x-default`), and that all visible strings come from locale messages rather than hard-coded component copy. The runtime mechanism that the Next.js application uses to consume translated content was, however, undecided: no library was installed, no `[locale]` segment existed, no proxy/middleware performed locale negotiation, and no message catalogs were defined.

A public marketing home page is the first indexable surface, so the localization mechanism must be decided before any user-facing page is built.

## Decision

`apps/product-core` uses **next-intl** with App Router locale-based routing:

- Locales are `en`, `ru`, `uk`; the default locale is `en`.
- Routing is locale-prefixed with `localePrefix: 'always'`, so every page is served under `/[locale]/*` and the bare `/` is redirected to the default locale by the proxy.
- Routing is declared once in `src/i18n/routing.ts` via `defineRouting`; `src/i18n/navigation.ts` exposes `createNavigation(routing)` for typed links.
- Request-time locale resolution lives in `src/i18n/request.ts` via `getRequestConfig`, which loads `messages/<locale>.json`.
- The Next.js 16 network-boundary file is `src/proxy.ts` (Next.js 16 renamed `middleware.ts` to `proxy.ts`). It runs `next-intl`'s middleware factory as the default export and excludes `api`, `_next`, and static assets from its matcher.
- The root layout moves to `src/app/[locale]/layout.tsx`. It renders `NextIntlClientProvider`, sets `<html lang={locale}>`, and produces typed metadata with `alternates.languages` hreflang entries for `en`, `ru`, `uk`, and `x-default` (SEO.md contract).
- Message catalogs are local JSON files under `src/messages/<locale>.json`. Catalogs must keep key parity across locales.

## Message ownership

Directus remains the system of record for translated content per ADR-005. For the MVP, however, the marketing home-page copy is co-located as local JSON catalogs in `product-core` so the page can ship before the CMS content pipeline exists. Migrating the source of these catalogs to Directus (fetch at build or request time) is a future slice and will not change this ADR's routing decision. Catalog key structure is the integration contract with Directus.

## Consequences

- Every indexable route is locale-prefixed; the bare `/` redirects to `/en`.
- Adding a page requires a matching entry (and parity across `en`, `ru`, `uk`) in each `messages/<locale>.json`.
- Proxy/middleware code must use the Next.js 16 `proxy.ts` convention; importing or referring to `middleware.ts` is incorrect on this Next.js version.
- Client components obtain translations through `next-intl` hooks after `NextIntlClientProvider` is mounted in the locale layout.
