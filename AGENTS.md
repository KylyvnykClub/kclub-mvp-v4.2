# Engineering Contract

These rules apply to every human and AI agent. They are mandatory. A task that cannot follow them must stop and record an ADR or a clarification; it must not invent a local exception.

## Read order

1. This file.
2. `docs/ARCHITECTURE.md`, `docs/CODING_STANDARDS.md`, and `docs/DESIGN_SYSTEM.md`.
3. The feature's contract, validation schema, domain module, and nearest existing test.
4. Relevant ADRs and `docs/patterns/` template.

## Required checks before code

- Reuse an existing shared component before creating UI.
- Reuse a token, a variant, a validation schema, a contract, and a domain action before adding a new one.
- Identify the owning module and permission before changing data or exposing an operation.
- Add or update focused tests for changed behavior.
- For a new library, provider, or irreversible structural decision, add an ADR before implementation.

## Absolute rules

- TypeScript is strict. JavaScript, JSDoc-as-types, `any`, and untyped JSON are prohibited in application code.
- UI primitives are reusable and presentational. They contain no domain rules, authorization decisions, provider calls, database access, or feature-specific status transitions.
- `apps/product-core` is the only runtime owner of core database access, domain writes, Stripe secret operations, webhooks, and cron/job execution.
- `apps/admin-app` uses typed product-core APIs only. Direct database, Prisma, and Stripe imports are forbidden there.
- Directus is CMS-only. It may manage pages, FAQ, legal documents, SEO, translations, and media; it must not connect to or mutate the core schema.
- Every external input is validated at the boundary. Every sensitive mutation is permission-checked, idempotent where retryable, transactional where needed, and audited.
- Raw visual values are allowed only in shared token files. Feature components do not create one-off colors, spacing, font sizes, radii, shadows, or z-index scales.
- Do not copy a component to make a variation. Extend its typed variants or compose existing primitives.
- Do not introduce a new local convention when a documented project convention exists.

## Stop conditions

Stop and document the ambiguity instead of guessing when a change needs a new role, permission, lifecycle state, external provider, database owner, public URL policy, or design primitive.

## Definition of done

Run the scoped checks, update contracts and documentation, verify permissions and responsive behavior where applicable, and leave the repository consistent with the rules above.
