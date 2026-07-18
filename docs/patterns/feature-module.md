# Feature Module Pattern

Use this for every new domain feature.

```text
packages/contracts/src/<feature>.ts       DTOs, input/output types, route constants
packages/validation/src/<feature>.ts      Zod schemas
packages/domain/src/<feature>/             pure states, policies, transitions
apps/product-core/src/server/<feature>/    repositories, service commands, routes
apps/product-core/src/features/<feature>/  member/public feature composition
apps/admin-app/src/features/<feature>/     admin composition through typed API
```

The feature's public entrypoint exports what other modules may use. Its routes call service commands, never repositories directly. Its UI composes `@kclub/ui` and does not duplicate contracts or decisions.
