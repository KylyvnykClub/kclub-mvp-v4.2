# ADR-012: Staff Credentials, MFA, and BFF Sessions

Status: Accepted

Staff credentials are separate from member Supabase Auth and are owned by product-core in core PostgreSQL. Passwords use Argon2id through `@node-rs/argon2`. TOTP uses `otpauth`; QR enrollment uses `qrcode`. Recovery codes, invitation tokens, challenges, and session tokens are stored only as hashes. TOTP secrets and staff phones are encrypted with the product-core staff-auth encryption key.

An OWNER-approved, single-use invitation is required before setting a password. A protected idempotent seed creates the first OWNER allowlist record and one invitation. The plaintext invitation is emitted once to the invoking protected operator channel and is never persisted or logged.

Password verification creates a five-minute MFA challenge, not a session. A verified TOTP or unused recovery code creates a revocable eight-hour database session. Product-core returns its opaque token only to the admin-app server. The admin BFF stores it in an `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/` cookie and forwards it as a bearer token to product-core; browser JavaScript cannot access the token.

Refine coordinates routing, queries, and UI access hints. Product-core remains the final authorization authority, and sensitive commands never use generic CRUD mutations.
