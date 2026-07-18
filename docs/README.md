# Documentation Map

| Document                                          | Purpose                                                        |
| ------------------------------------------------- | -------------------------------------------------------------- |
| `ARCHITECTURE.md`                                 | System boundaries and ownership.                               |
| `STACK.md`                                        | Approved technologies and upgrade policy.                      |
| `CODING_STANDARDS.md`                             | TypeScript, functional architecture, API, and component rules. |
| `DESIGN_SYSTEM.md`                                | Tokens, shared UI, class naming, and responsive rules.         |
| `DATABASE.md` and `ERD.md`                        | Postgres, Prisma, data ownership, and persistence model.       |
| `SECURITY.md`                                     | Authentication, permissions, secrets, audit, and privacy.      |
| `BILLING.md`                                      | Stripe ownership and subscription lifecycle.                   |
| `CI_CD.md`, `ENVIRONMENTS.md`, `OBSERVABILITY.md` | Delivery and operating model.                                  |
| `SEO.md`                                          | Public discovery, metadata, and structured data.               |
| `TEST_PLAN.md` and `VALIDATION.md`                | Quality gates and release evidence.                            |
| `BACKLOG.md`                                      | Ordered delivery plan.                                         |

Decision records in `adr/` are binding unless superseded by a newer ADR. `agents/` holds LLM-specific operating instructions; `patterns/` is the required starting point for new feature modules.
