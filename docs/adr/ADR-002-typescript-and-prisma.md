# ADR-002: Strict TypeScript and Prisma

Status: Accepted

Application code is TypeScript strict. Prisma is the ORM and migration system for core PostgreSQL. This replaces the previous JavaScript/JSDoc + Drizzle direction because the system has numerous permissions, lifecycle states, DTOs, and financial records where compile-time contracts materially reduce ambiguity. Prisma migrations are reviewed and deployed through protected CI.
