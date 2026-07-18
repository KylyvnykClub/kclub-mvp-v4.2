# Security

## Identity and sessions

Members use Supabase Auth with phone + password. SMS is limited to sign-up verification, password recovery, and an explicitly approved migration flow. Staff authentication is a separate product-core-owned flow with secure, `HttpOnly`, `Secure`, `SameSite` session cookies; staff access requires MFA before production launch.

Authentication proves identity. Authorization is product-core permission evaluation on every protected route and command. The UI never treats a hidden navigation item as access control.

## Permissions

Roles are permission bundles. Initial permissions include `MEMBER_VIEW`, `MEMBER_APPROVE`, `MEMBER_SUSPEND`, `CARD_ISSUE`, `CARD_REVOKE`, `PARTNER_MODERATE`, `PARTNER_PUBLISH`, `INTRODUCTION_MANAGE`, `SUBSCRIPTION_VIEW`, `SUBSCRIPTION_MANAGE`, `REFUND_CREATE`, `CONTENT_EDIT`, `CONTENT_PUBLISH`, `SUPPORT_MANAGE`, `STAFF_MANAGE`, `AUDIT_VIEW`, and `SYSTEM_CONFIGURE`.

Every endpoint must test both permission and resource scope. Default access is deny. Support is read-only unless a specific permission grants a narrowly defined action.

## Boundary rules

- Validate all external data with Zod; validate provider payloads before use.
- Apply rate limits and abuse controls to authentication, card verification, password recovery, uploads, and public search where needed.
- Verify Stripe webhook signatures against the unmodified request body before parsing business events.
- Keep private uploads private. Serve evidence and identity documents only through short-lived, scoped signed URLs.
- Do not expose raw QR tokens, phone numbers, Stripe secrets, database URLs, Supabase secret keys, or internal errors.
- Use correlation/request IDs; redact sensitive fields from structured logs.

## Audit and incident handling

Audit events are append-only and include actor, action, resource, reason code, request ID, and safe before/after metadata. High-risk actions require an explicit reason and confirmation. Security events, webhook failures, and repeated authorization denials are observable and alertable.

## Secrets

Secrets exist only in local secret stores, GitHub Actions secrets, Vercel environment variables, or provider secret stores. They never enter code, browser variables, logs, screenshots, fixtures, or CMS content. Rotate exposed credentials immediately and record the incident.
