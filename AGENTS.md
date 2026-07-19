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

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **kclub-mvp-v4.2** (353 symbols, 463 relationships, 10 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({search_query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/kclub-mvp-v4.2/context` | Codebase overview, check index freshness |
| `gitnexus://repo/kclub-mvp-v4.2/clusters` | All functional areas |
| `gitnexus://repo/kclub-mvp-v4.2/processes` | All execution flows |
| `gitnexus://repo/kclub-mvp-v4.2/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
