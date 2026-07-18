# ADR-008: Supabase Boundary

Status: Accepted

Supabase provides hosted PostgreSQL, member identity infrastructure, and object storage. Product-core remains the authorization and domain-policy authority. Supabase secret keys and direct database access are server-only. Staging and production use isolated projects; public and private storage have separate access policies.
