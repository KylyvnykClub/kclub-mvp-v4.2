# Delivery Backlog

## P0: Foundation

- Bootstrap strict TypeScript `pnpm` workspace, Turbo tasks, package boundaries, root validation, and agent documentation.
- Create `packages/contracts`, `validation`, `domain`, `database`, `ui`, and `test-utils` with public entrypoints.
- Provision local/development/staging/production configuration, Supabase projects, Vercel, GitHub Actions, secret handling, backups, and observability.
- Implement identity baseline, permission model, staff sessions/MFA plan, audit envelope, and Prisma initial migration.

## P1: Club operations

- Members/applications: onboarding, review queue, approval/rejection, suspension, audit.
- Membership cards: issuance, revocation, rotation, public privacy-safe verification, verification log.
- Partners/offers: ownership, evidence, moderation, publication, expiration, localized content.
- Refine admin shell: resource routing, access control provider, typed product-core client, dashboard queues, staff management, audit log.

## P2: Revenue and service

- Stripe products/prices configuration, Checkout, portal, webhook processor, idempotency, reconciliation, subscription/payment admin views.
- Introductions, consent workflow, support tickets, notifications, scheduled expiration/reconciliation jobs.

## P3: Content and growth

- Directus CMS isolation, content schemas, publication workflow, locales, SEO metadata, media policies.
- Public directory, structured data, OG images, analytics/privacy review, SEO monitoring.

## Definition of done

Every delivered slice has a contract, authorization policy, audit behavior where sensitive, responsive/reusable UI, focused tests, documentation updates, deployment and rollback consideration, and no bypass of the architecture boundaries.
