# Coding Standards

## TypeScript

- Enable `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and `noImplicitOverride`.
- Use `unknown` for untrusted data and narrow it with Zod or type guards. `any`, unsafe assertions, and `@ts-ignore` are prohibited.
- Prefer named exports, `type` for data shapes, `interface` only for externally extended contracts, and discriminated unions for states and results.
- Write English identifiers, comments, errors, commits, and documentation. Comments explain constraints or intent, never syntax.

## Functional architecture

Use functions and immutable values by default. A domain function is pure: given input and dependencies, it returns a typed result without reading globals or doing I/O. Dependencies are explicit factory parameters. Classes require a documented external-library reason.

```ts
export const approveMembership =
  (deps: MembershipDependencies) =>
  async (input: ApproveMembershipInput): Promise<Result<MembershipDto, DomainError>> => {
    // validate transition, authorize, transact, audit, publish event
  };
```

## Feature boundary

```text
feature/
  api/          typed product-core client or route adapter
  components/   feature composition only
  hooks/        UI state and queries only
  schemas/      feature-level adapters around shared Zod schemas
  services/     product-core command orchestration only
  tests/
```

Components render supplied data and emit typed callbacks. They do not import Prisma, Stripe, server secrets, permission evaluators, repositories, or domain transition functions. Feature containers may coordinate UI state, but business decisions live in `packages/domain` and product-core services.

## API and persistence

- Validate every request, query, provider webhook, and environment value at its boundary.
- Routes are thin: authenticate, validate, call one command, serialize a typed response.
- A command checks authorization, validates the state transition, performs a transaction when necessary, writes audit events, and emits side effects after durable state succeeds.
- Never return database models directly. Return DTOs from `packages/contracts`.
- Retryable writes use idempotency keys. Sensitive state changes require an audit record with actor, action, resource, reason, request ID, and safe metadata.

## Naming and imports

- Files: `kebab-case.ts`; React components: `PascalCase.tsx`; tests: `*.test.ts` or `*.spec.ts`.
- Domain verbs use intent: `approveMember`, `issueCard`, `revokeCard`, `publishOffer`; avoid generic `updateStatus`.
- Import through package public entrypoints. Deep imports and cross-feature relative imports are forbidden unless exposed by the feature's public API.

## Required review checks

Before a new abstraction, prove that an existing component, token, schema, contract, or command cannot serve it. Before a new permission, status, table, provider, or background job, add an ADR and tests for allowed and forbidden behavior.
