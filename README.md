# KYLYVNYK CLUB MVP V4.2

This repository is the clean, TypeScript-first foundation for KYLYVNYK CLUB. It is deliberately documentation-led: implementation starts only after its contracts, ownership boundaries, operating model, and quality gates are understood.

## Product shape

- Public multilingual web experience and member cabinet.
- Operations back office for staff, moderation, cards, partners, support, billing, and audit.
- CMS workspace for public pages, translations, legal content, SEO, and media.

## Non-negotiable architecture

`apps/product-core` owns domain rules, database writes, authentication decisions, Stripe webhooks, background jobs, and the public/member web surface. `apps/admin-app` is an authenticated operational UI and BFF shell; it never accesses PostgreSQL or Stripe directly. Directus owns content only and never writes core-domain tables.

Read [AGENTS.md](AGENTS.md) before changing or generating code. The documentation index is [docs/README.md](docs/README.md).
