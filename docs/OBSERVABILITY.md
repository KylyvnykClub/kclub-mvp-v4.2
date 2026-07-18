# Observability and Operations

Every request receives or creates a correlation ID propagated through API calls, audit events, provider operations, and logs. Structured logs contain event name, level, request ID, actor/resource identifiers when safe, duration, and outcome; they never contain credentials or raw PII.

## Required signals

- Error tracking: unhandled server/client errors, release version, sanitized context.
- Health: liveness and readiness endpoints that distinguish process health from dependency readiness.
- Metrics: request latency/error rate, job latency/failure/retry counts, database errors, webhook processing, auth abuse, card verification, and workflow queue counts.
- Business state: pending applications, partner reviews, failed payments, expired cards/offers, open support tickets, and unresolved webhook failures.
- Audit: sensitive staff and system actions retained independently of ordinary application logs.

## Alerts and runbooks

Document escalation and remediation for database connectivity, auth/SMS outage, Stripe webhook failures, payment reconciliation mismatch, Vercel deployment failure, storage access failure, and suspected data/security incident. Every alert must link to a runbook and every scheduled job must expose its last-success status.
