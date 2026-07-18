# Environments and Configuration

| Environment | Purpose                   | Data rule                                        |
| ----------- | ------------------------- | ------------------------------------------------ |
| Local       | developer work            | local/synthetic data only                        |
| Development | shared integration        | synthetic data; disposable                       |
| Staging     | production rehearsal      | production-like configuration; no production PII |
| Production  | real members and partners | isolated providers and least-privilege access    |

Staging and production have separate Supabase projects, Stripe accounts or modes, Directus instances, storage buckets, webhook endpoints, and secrets. Production configuration is never copied down.

## Configuration rules

- Validate environment variables at process start with a server/client split schema.
- Browser-exposed variables contain only explicitly public values. Database URLs, Stripe secrets, webhook secrets, Supabase secret keys, cron secrets, and encryption keys are server-only.
- Provide `.env.example` with names and safe descriptions, never values.
- Rotate credentials by provider, update deployment secrets, validate, and record the change.
- Scheduled endpoints authenticate with a dedicated `CRON_SECRET`, do not rely on obscurity, and log each run.
