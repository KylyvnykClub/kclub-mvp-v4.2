# Service Command Pattern

```ts
export const createIssueCardCommand =
  (deps: IssueCardDependencies) =>
  async (input: IssueCardInput, actor: Actor): Promise<Result<CardDto, DomainError>> => {
    const permission = requirePermission(actor, 'CARD_ISSUE');
    if (permission.isErr()) return permission;

    const parsed = issueCardInputSchema.safeParse(input);
    if (!parsed.success) return invalidInput(parsed.error);

    return deps.database.transaction(async (tx) => {
      const card = await deps.cards.issue(tx, parsed.data);
      await deps.audit.record(tx, auditForCardIssued(actor, card));
      return ok(toCardDto(card));
    });
  };
```

Actual project helpers may differ, but the responsibilities do not: validation, permission, invariant/state transition, transaction, audit, safe DTO. Provider calls are idempotent and occur only with a durable retry/event plan.
