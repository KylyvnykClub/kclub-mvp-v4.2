-- Migration: extend_partners
-- Extends Partner with owner, phone, featured toggles, Stripe billing fields.
-- Converts country from PartnerCountry enum to free ISO alpha-2 string.
-- Adds StripeWebhookEvent table for webhook dedup (ADR-006).

-- 1. Convert country from enum to text with data backfill
ALTER TABLE "partners" ALTER COLUMN "country" TYPE TEXT
  USING CASE
    WHEN "country"::text = 'GERMANY' THEN 'de'
    WHEN "country"::text = 'SWITZERLAND' THEN 'ch'
    WHEN "country"::text = 'POLAND' THEN 'pl'
    WHEN "country"::text = 'UKRAINE' THEN 'ua'
    ELSE lower("country"::text)
  END;

-- 2. Drop the old enum type
DROP TYPE "PartnerCountry";

-- 3. Add new partner columns
ALTER TABLE "partners"
  ADD COLUMN "city" TEXT,
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "owner_id" UUID,
  ADD COLUMN "featured_top" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "featured_recommended" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "stripe_customer_id" TEXT,
  ADD COLUMN "stripe_subscription_id" TEXT,
  ADD COLUMN "stripe_price_id" TEXT,
  ADD COLUMN "subscription_status" TEXT NOT NULL DEFAULT 'NONE',
  ADD COLUMN "current_period_start" TIMESTAMPTZ(6),
  ADD COLUMN "current_period_end" TIMESTAMPTZ(6),
  ADD COLUMN "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false;

-- 4. Create SubscriptionStatus enum and convert the column
CREATE TYPE "SubscriptionStatus" AS ENUM ('NONE', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED');
ALTER TABLE "partners" ALTER COLUMN "subscription_status" DROP DEFAULT;
ALTER TABLE "partners" ALTER COLUMN "subscription_status" TYPE "SubscriptionStatus" USING "subscription_status"::"SubscriptionStatus";
ALTER TABLE "partners" ALTER COLUMN "subscription_status" SET DEFAULT 'NONE'::"SubscriptionStatus";

-- 5. Foreign key and unique constraints
ALTER TABLE "partners"
  ADD CONSTRAINT "partners_owner_id_fkey"
    FOREIGN KEY ("owner_id") REFERENCES "members"("id") ON DELETE SET NULL;

CREATE UNIQUE INDEX "partners_stripe_subscription_id_key"
  ON "partners"("stripe_subscription_id");

-- 6. Stripe webhook event dedup table (per ADR-006)
CREATE TABLE "stripe_webhook_events" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "stripe_event_id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "processed_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "stripe_webhook_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "stripe_webhook_events_stripe_event_id_key"
  ON "stripe_webhook_events"("stripe_event_id");
