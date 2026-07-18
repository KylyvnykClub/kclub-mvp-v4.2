# SEO and Discoverability

## Indexable surface

Only public, locale-prefixed, useful pages are indexable: `/en`, `/ru`, `/uk`, approved public directory/detail pages, and approved CMS pages. Member, partner, staff, API, search, filtered, preview, checkout, and empty-category routes are `noindex` and excluded from the sitemap.

## Per-page contract

Every indexable page has a localized unique title and description, one descriptive H1, canonical URL for its own locale, `hreflang` alternates for `en`, `ru`, `uk`, and `x-default`, Open Graph/Twitter metadata, meaningful server-rendered content, and sitemap inclusion. Metadata is produced through typed Next.js metadata helpers, not scattered page constants.

## Content and structured data

Directus stores page copy, SEO fields, and media only after translation/status validation. JSON-LD uses organization, breadcrumb, and verified business schemas only when supporting data exists. Claims such as "verified", counts, testimonials, and business attributes must describe the exact supported evidence; no invented marketing data.

## Quality checks

- All canonical and alternate URLs return 200 and agree with their rendered locale.
- Sitemaps list indexable canonical URLs only and have no redirects/duplicates.
- Private routes are absent from sitemaps and use `noindex` defense in depth.
- Locale switching preserves the logical page where possible.
- CI checks translation completeness, metadata, broken internal links, robot rules, structured-data validity, and accidental empty listings.
