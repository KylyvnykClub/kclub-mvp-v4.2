# API Route Pattern

```ts
export const POST = async (request: Request): Promise<Response> => {
  const context = await requireApiContext(request);
  const body = await request.json();
  const result = await approveMemberCommand({ body, actor: context.actor });
  return toApiResponse(result, context.requestId);
};
```

The real route obtains the correct product-core dependencies through a server composition root. A route never implements state transitions, Prisma queries, billing logic, or duplicated validation. Errors use one stable envelope with a code, localized-safe message key, details safe for the caller, and request ID.
