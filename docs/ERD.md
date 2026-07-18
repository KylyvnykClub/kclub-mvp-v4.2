# Core Data Model

This is the logical core model. Prisma is the executable schema. Directus content tables are intentionally absent because CMS data has a separate owner.

```mermaid
erDiagram
  USER ||--o{ MEMBERSHIP_APPLICATION : submits
  USER ||--o{ MEMBERSHIP : has
  MEMBERSHIP ||--o{ MEMBERSHIP_CARD : owns
  USER ||--o{ BUSINESS : owns
  BUSINESS ||--o{ OFFER : publishes
  USER ||--o{ INTRODUCTION_REQUEST : requests
  BUSINESS ||--o{ INTRODUCTION_REQUEST : targets
  STAFF_USER ||--o{ AUDIT_EVENT : acts
  USER ||--o{ SUBSCRIPTION : holds
  SUBSCRIPTION ||--o{ PAYMENT : records
  STRIPE_WEBHOOK_EVENT }o--|| PAYMENT : reconciles
  MEMBERSHIP_CARD ||--o{ CARD_VERIFICATION : verifies

  USER { uuid id PK; string auth_subject UK; string phone_hash UK; enum locale; timestamp created_at }
  MEMBERSHIP_APPLICATION { uuid id PK; uuid user_id FK; enum status; string review_reason_code; timestamp submitted_at }
  MEMBERSHIP { uuid id PK; uuid user_id FK; enum tier; enum status; timestamp activated_at }
  MEMBERSHIP_CARD { uuid id PK; uuid membership_id FK; string card_number UK; string credential_hash UK; enum status; timestamp expires_at }
  CARD_VERIFICATION { uuid id PK; uuid card_id FK; enum result; string verifier_context; timestamp created_at }
  BUSINESS { uuid id PK; uuid owner_user_id FK; string slug UK; enum status; timestamp created_at }
  OFFER { uuid id PK; uuid business_id FK; enum status; timestamp valid_from; timestamp valid_until }
  INTRODUCTION_REQUEST { uuid id PK; uuid requester_user_id FK; uuid target_business_id FK; enum status; json consent_state }
  STAFF_USER { uuid id PK; string phone_hash UK; enum role; boolean is_active }
  AUDIT_EVENT { uuid id PK; uuid actor_staff_id FK; string action; string resource_type; uuid resource_id; string request_id; json metadata }
  SUBSCRIPTION { uuid id PK; uuid user_id FK; string stripe_customer_id UK; string stripe_subscription_id UK; enum status; timestamp current_period_end }
  PAYMENT { uuid id PK; uuid subscription_id FK; string stripe_invoice_id UK; string currency; int amount_minor; enum status }
  STRIPE_WEBHOOK_EVENT { uuid id PK; string stripe_event_id UK; string type; timestamp received_at; timestamp processed_at; string processing_status }
```

## Invariants

- One active non-rejected membership application per user where policy requires it.
- One active card per membership; card number and credential hash are globally unique; raw QR credentials are never stored.
- Business slug is unique; a user cannot own conflicting active business records without an explicit policy exception.
- Every approved/rejected/suspended/revoked financial, card, moderation, role, or privacy action has an audit event in the same transaction.
- Stripe event ID, customer ID, subscription ID, invoice ID, and external idempotency keys are unique where applicable.
- Dates use UTC; money is integer minor units plus ISO currency code; localized copy belongs to CMS or a dedicated localized-content model, never arbitrary JSON without schema.
