# ADR-009: Member Auth and Staff Sessions

Status: Accepted

Members authenticate with phone + password. SMS is restricted to sign-up verification, recovery, and explicitly approved migration. Staff use a separate product-core-owned session model with secure cookie transport and MFA before launch. Member and staff policies, schemas, and session scopes must not be weakened or conflated.
