# Validation Record Template

Do not mark a gate passed until it has actually run in the stated environment. This file is a release record, not a wish list.

```md
## Release

Date:
Commit:
Environment:
Approver:

## Automated gates

- [ ] pnpm install --frozen-lockfile
- [ ] format / lint / typecheck
- [ ] unit / integration / contract tests
- [ ] Prisma schema, migration drift, and deployment rehearsal
- [ ] build and preview/staging smoke test
- [ ] Playwright mobile and critical desktop flows
- [ ] accessibility / SEO / locale checks
- [ ] dependency and secret scanning

## Operational gates

- [ ] backup restore rehearsal
- [ ] Stripe webhook duplicate/replay and reconciliation check
- [ ] health, error tracking, alerts, and cron last-success verified
- [ ] rollback plan verified

## Exceptions

Risk, reason, owner, mitigation, expiry date:
```
