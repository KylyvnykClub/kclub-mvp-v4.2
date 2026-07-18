# Approved Stack

| Concern         | Decision                             | Rule                                                                                            |
| --------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Language        | TypeScript, `strict: true`           | No JavaScript application modules or JSDoc type substitute.                                     |
| Package manager | `pnpm`                               | The only lockfile is `pnpm-lock.yaml`; no Bun/npm lockfiles.                                    |
| Workspace/build | pnpm workspaces + Turborepo          | Shared packages are built and checked through workspace tasks.                                  |
| Web             | Next.js App Router + React           | Server components by default; client boundaries only for browser interaction.                   |
| Admin           | Refine.dev + React                   | Refine provides resource/routing/data abstractions; product-core remains the API authority.     |
| Database        | Supabase hosted PostgreSQL           | Separate projects for staging and production.                                                   |
| ORM             | Prisma                               | Schema and migrations live in `packages/database`; client generation is an explicit build step. |
| Validation      | Zod                                  | One boundary schema is shared instead of duplicated UI/API validation.                          |
| Auth/storage    | Supabase Auth and Storage            | Auth is identity infrastructure; authorization stays in product-core.                           |
| Payments        | Stripe Billing                       | Stripe webhooks are authoritative for paid entitlement state.                                   |
| CMS             | Directus                             | Separate CMS database or an isolated `cms` schema, never core-domain writes.                    |
| Testing         | Vitest, MSW, Playwright              | Unit, contract/integration, and browser levels are all required.                                |
| Deployment      | Vercel + GitHub Actions              | Vercel deploys apps; GitHub Actions enforces CI, migrations, and scheduled operational tasks.   |
| Observability   | Sentry, Vercel logs, structured logs | All requests carry a correlation ID.                                                            |

Versions are pinned in `package.json` and the lockfile, not this document. Upgrade a dependency intentionally, read current primary documentation, record material migration risks, and run the complete validation gate.

## Prisma release rule

Developers create reviewed, checked-in migrations with `prisma migrate dev`. CI applies already-reviewed pending migrations in staging/production using `prisma migrate deploy`; application runtime never runs development migration commands. Prisma Client generation is explicit before typecheck/build.
