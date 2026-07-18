# ADR-003: product-core Owns Domain and Data

Status: Accepted

`apps/product-core` is the only runtime owner of core database access, mutations, business policies, external-provider secret operations, webhooks, cron/jobs, and audit records. Other applications use typed APIs. This protects invariants and prevents each UI surface from becoming a second backend.
