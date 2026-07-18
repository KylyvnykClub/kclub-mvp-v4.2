# CI/CD

## Pull request gate

GitHub Actions runs deterministic installation from the pinned pnpm lockfile, formatting, lint, TypeScript checks, unit tests, contract/integration tests, Prisma validation and migration-drift checks, build, dependency/security scan, and focused Playwright smoke coverage. A failing check blocks merge.

The implemented baseline currently runs formatting, lint, typecheck, unit, contract, integration, build, Prisma schema validation, and Playwright smoke coverage on every pull request. Migration-drift, dependency/secret scanning, and deployment smoke automation remain release-foundation work and must not be reported as active until their workflows exist.

## Deployment flow

```text
pull request -> preview deployment -> review + CI -> protected merge
  -> staging build -> approved migration job -> staging smoke checks
  -> production build -> approved production migration job -> production smoke checks
```

Vercel produces preview deployments for pull requests and production deployments for the protected branch. Production deployment and production migration are independently visible, authorized operations. Schema changes are forward-compatible before application code relies on them.

## Migration and rollback

`prisma migrate deploy` runs only in the protected release workflow with the relevant direct database connection. No Vercel build or runtime process migrates databases. Rollback is application-first whenever possible; an irreversible migration requires an ADR, backup/recovery procedure, and staging rehearsal.

## Required repository automation

- `pnpm install --frozen-lockfile`
- `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:integration`, `pnpm test:e2e`
- `pnpm db:validate`, migration status/drift check, `pnpm build`
- content translation-shape validation, route/SEO checks, and secret scanning

Command names may evolve, but every named gate must remain represented in CI and locally runnable through the root workspace.
