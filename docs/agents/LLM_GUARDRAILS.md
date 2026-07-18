# LLM Guardrails

An agent works inside the existing architecture, not beside it. It must read `AGENTS.md`, the relevant ADRs, and the applicable pattern before editing.

## Mandatory decision sequence

1. Name the feature owner and affected contract.
2. Find an existing component, token, schema, domain command, and permission.
3. Reuse them or explain why a new shared abstraction is necessary.
4. Implement the smallest coherent change in the correct layer.
5. Add allowed and forbidden tests; validate the affected UI states.
6. Update documentation and ADRs when boundaries change.

## Prohibited shortcuts

- Adding a one-off button, form field, status badge, table, class name, raw color, or local design token.
- Putting `fetch`, database queries, Stripe calls, authorization checks, or status transitions inside a shared UI component.
- Calling Prisma or Stripe from admin-app, client code, server actions outside product-core, or Directus extensions.
- Accepting a client-provided role, price, entitlement, status, user ID, or payment result without server verification.
- Bypassing a missing API/contract with direct database access.
- Duplicating a Zod schema, status union, or permission literal in a feature.

## Required answer when blocked

State the missing decision, name the possible owners/options, identify the impacted contract or policy, and request an ADR/clarification. Do not fabricate data or behavior to make a screen appear complete.
