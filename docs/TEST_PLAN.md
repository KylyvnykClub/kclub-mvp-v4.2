# Test Plan

## Required levels

| Level       | What it proves                                                            | Tooling                           |
| ----------- | ------------------------------------------------------------------------- | --------------------------------- |
| Static      | formatting, types, boundaries, locale shapes, token policy                | ESLint, TypeScript, custom checks |
| Unit        | pure domain states, permissions, policies, formatters                     | Vitest                            |
| Integration | routes, services, repositories, transactions, provider adapters           | Vitest + test database/MSW        |
| Contract    | DTOs, Zod schemas, product-core/admin-app compatibility, webhook fixtures | shared contracts                  |
| E2E         | real browser critical paths, mobile, accessibility, SEO                   | Playwright                        |
| Operational | migrations, restore, webhook replay, cron, incident runbooks              | staging rehearsals                |

## Mandatory cases

- Permission negative cases for every sensitive command and resource-scope/IDOR attempts.
- Membership, cards, partner moderation, offers, introductions, support, and staff lifecycle state transitions: allowed and forbidden.
- Member phone/password sign-in; SMS only for registration verification, recovery, and approved migration; staff auth separately.
- Stripe invalid signature, duplicate event, out-of-order event, refund, cancellation, failed payment, replay, and reconciliation.
- Public card verification never exposing PII; malformed/expired/revoked/unknown credentials and rate limits.
- EN/RU/UK key parity, route rendering, locale metadata/alternates, localized sitemap, and noindex policy.
- Token enforcement, shared component variants, keyboard, focus, error/loading/empty states, 320px width, Pixel/Chrome and iPhone/WebKit critical flows.
- Prisma migration apply, drift detection, backup restore, and forward-compatible release rehearsal.

## Rules

Defect fixes begin with a regression test where practical. Tests use deterministic factories from `packages/test-utils` and synthetic data only. Test business outcomes, not private implementation details. A release cannot replace a failed security, migration, or payment test with a manual claim.

## Local commands

| Command                 | Scope                                                     |
| ----------------------- | --------------------------------------------------------- |
| `pnpm test:unit`        | Pure domain, validation, utility, and component behavior. |
| `pnpm test:contract`    | Shared DTO and boundary-schema compatibility.             |
| `pnpm test:integration` | Services, adapters, repositories, and network boundaries. |
| `pnpm test:coverage`    | Unit and contract coverage with enforced thresholds.      |
| `pnpm test:e2e:smoke`   | Critical product-core and admin browser paths.            |
| `pnpm test:e2e`         | Full configured Playwright matrix.                        |
| `pnpm validate`         | Merge-blocking local non-browser validation.              |

Vitest projects are defined centrally in `vitest.config.ts`. Unit tests live beside their owning workspace under `tests/`; cross-package contract and integration suites live under root `tests/contract` and `tests/integration`. Playwright owns `tests/e2e` and starts both Next.js applications automatically.

The integration setup rejects unhandled network requests. A test that calls an external provider must declare an MSW handler or intentionally use a separately documented sandbox adapter.
