# Vercel Setup

Vercel deployment is Git-driven. This repository does not contain deployment secrets or a Vercel access token.

## Create two projects

1. Import `KylyvnykClub/kclub-mvp-v4.2` into Vercel as `kclub-product-core`; select `apps/product-core` as the project root directory.
2. Import the same repository again as `kclub-admin-app`; select `apps/admin-app` as the project root directory.
3. Keep Vercel's pnpm/Turborepo auto-detection. The build must run from the monorepo root and build the selected app.
4. Link `main` to Production. Pull requests receive Preview deployments automatically.

## Environment variables

Configure variables separately for Preview, Staging, and Production. Do not use production values in Preview.

- `NEXT_PUBLIC_APP_URL` is public and environment-specific.
- `DATABASE_URL`, `DATABASE_URL_DIRECT`, Supabase secret keys, Stripe secret keys, webhook secrets, encryption keys, and `CRON_SECRET` are server-only.
- `admin-app` receives only its product-core API origin and staff-session configuration; it never receives database or Stripe credentials.

## Migration boundary

Vercel builds do not run database migrations. Configure GitHub Environments named `staging` and `production`, add a protected `DATABASE_URL_DIRECT` secret to each, and run the manual `Deploy database migrations` workflow after the application release is approved.

## First deployment

The current deployable proof is `product-core`. Visit its Preview URL after the first push. Add Supabase, Stripe, custom domains, and production webhook endpoints only when their first feature slices exist.
