CREATE TYPE "StaffRole" AS ENUM ('OWNER', 'ADMIN', 'MODERATOR', 'SUPPORT', 'FINANCE', 'CONTENT_MANAGER');

CREATE TABLE "staff_users" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "phone_hash" TEXT NOT NULL,
  "phone_cipher" TEXT NOT NULL, "role" "StaffRole" NOT NULL, "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "staff_users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "staff_users_phone_hash_key" ON "staff_users"("phone_hash");

CREATE TABLE "staff_credentials" (
  "staff_id" UUID NOT NULL, "password_hash" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "staff_credentials_pkey" PRIMARY KEY ("staff_id")
);
CREATE TABLE "staff_invites" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "staff_id" UUID NOT NULL, "token_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMPTZ(6) NOT NULL, "consumed_at" TIMESTAMPTZ(6), "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "staff_invites_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "staff_invites_token_hash_key" ON "staff_invites"("token_hash");
CREATE INDEX "staff_invites_staff_id_expires_at_idx" ON "staff_invites"("staff_id", "expires_at");

CREATE TABLE "staff_mfa_methods" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "staff_id" UUID NOT NULL, "secret_cipher" TEXT NOT NULL,
  "verified_at" TIMESTAMPTZ(6), "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "staff_mfa_methods_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "staff_mfa_methods_staff_id_idx" ON "staff_mfa_methods"("staff_id");

CREATE TABLE "staff_recovery_codes" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "staff_id" UUID NOT NULL, "code_hash" TEXT NOT NULL,
  "consumed_at" TIMESTAMPTZ(6), "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "staff_recovery_codes_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "staff_recovery_codes_code_hash_key" ON "staff_recovery_codes"("code_hash");
CREATE INDEX "staff_recovery_codes_staff_id_idx" ON "staff_recovery_codes"("staff_id");

CREATE TABLE "staff_auth_challenges" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "staff_id" UUID NOT NULL, "token_hash" TEXT NOT NULL,
  "purpose" TEXT NOT NULL, "expires_at" TIMESTAMPTZ(6) NOT NULL, "consumed_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "staff_auth_challenges_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "staff_auth_challenges_token_hash_key" ON "staff_auth_challenges"("token_hash");
CREATE INDEX "staff_auth_challenges_staff_id_expires_at_idx" ON "staff_auth_challenges"("staff_id", "expires_at");

CREATE TABLE "staff_auth_rate_limits" (
  "key_hash" TEXT NOT NULL, "count" INTEGER NOT NULL, "reset_at" TIMESTAMPTZ(6) NOT NULL,
  "updated_at" TIMESTAMPTZ(6) NOT NULL, CONSTRAINT "staff_auth_rate_limits_pkey" PRIMARY KEY ("key_hash")
);
CREATE INDEX "staff_auth_rate_limits_reset_at_idx" ON "staff_auth_rate_limits"("reset_at");

CREATE TABLE "staff_sessions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "staff_id" UUID NOT NULL, "token_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMPTZ(6) NOT NULL, "revoked_at" TIMESTAMPTZ(6), "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_seen_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "staff_sessions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "staff_sessions_token_hash_key" ON "staff_sessions"("token_hash");
CREATE INDEX "staff_sessions_staff_id_expires_at_idx" ON "staff_sessions"("staff_id", "expires_at");

CREATE TABLE "audit_events" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "actor_staff_id" UUID, "action" TEXT NOT NULL,
  "resource_type" TEXT NOT NULL, "resource_id" TEXT, "request_id" UUID NOT NULL, "metadata" JSONB NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "audit_events_actor_staff_id_created_at_idx" ON "audit_events"("actor_staff_id", "created_at");
CREATE INDEX "audit_events_resource_type_resource_id_idx" ON "audit_events"("resource_type", "resource_id");

ALTER TABLE "staff_credentials" ADD CONSTRAINT "staff_credentials_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff_users"("id") ON DELETE CASCADE;
ALTER TABLE "staff_invites" ADD CONSTRAINT "staff_invites_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff_users"("id") ON DELETE CASCADE;
ALTER TABLE "staff_mfa_methods" ADD CONSTRAINT "staff_mfa_methods_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff_users"("id") ON DELETE CASCADE;
ALTER TABLE "staff_recovery_codes" ADD CONSTRAINT "staff_recovery_codes_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff_users"("id") ON DELETE CASCADE;
ALTER TABLE "staff_auth_challenges" ADD CONSTRAINT "staff_auth_challenges_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff_users"("id") ON DELETE CASCADE;
ALTER TABLE "staff_sessions" ADD CONSTRAINT "staff_sessions_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff_users"("id") ON DELETE CASCADE;
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_staff_id_fkey" FOREIGN KEY ("actor_staff_id") REFERENCES "staff_users"("id") ON DELETE SET NULL;
