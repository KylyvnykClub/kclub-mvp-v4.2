CREATE TYPE "ClubCardStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

CREATE TABLE "club_cards" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "member_id" UUID NOT NULL,
  "card_number" TEXT NOT NULL,
  "public_id" TEXT NOT NULL,
  "tier" TEXT NOT NULL DEFAULT 'MEMBER',
  "status" "ClubCardStatus" NOT NULL DEFAULT 'ACTIVE',
  "issued_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" TIMESTAMPTZ(6) NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "club_cards_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "club_cards_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "club_cards_card_number_key" ON "club_cards"("card_number");
CREATE UNIQUE INDEX "club_cards_public_id_key" ON "club_cards"("public_id");
CREATE INDEX "club_cards_member_id_status_idx" ON "club_cards"("member_id", "status");
CREATE UNIQUE INDEX "club_cards_one_active_per_member_idx"
  ON "club_cards"("member_id")
  WHERE "status" = 'ACTIVE';

INSERT INTO "club_cards" ("member_id", "card_number", "public_id", "issued_at", "expires_at", "created_at", "updated_at")
SELECT
  "id",
  'MEM-' || lpad(row_number() OVER (ORDER BY "created_at", "id")::text, 6, '0'),
  upper(left(replace("id"::text, '-', ''), 8)),
  "created_at",
  "created_at" + interval '1 year',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "members"
WHERE NOT EXISTS (
  SELECT 1
  FROM "club_cards"
  WHERE "club_cards"."member_id" = "members"."id"
    AND "club_cards"."status" = 'ACTIVE'
);
