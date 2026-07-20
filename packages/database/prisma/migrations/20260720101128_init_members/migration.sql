-- DropForeignKey
ALTER TABLE "audit_events" DROP CONSTRAINT "audit_events_actor_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "staff_auth_challenges" DROP CONSTRAINT "staff_auth_challenges_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "staff_credentials" DROP CONSTRAINT "staff_credentials_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "staff_invites" DROP CONSTRAINT "staff_invites_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "staff_mfa_methods" DROP CONSTRAINT "staff_mfa_methods_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "staff_recovery_codes" DROP CONSTRAINT "staff_recovery_codes_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "staff_sessions" DROP CONSTRAINT "staff_sessions_staff_id_fkey";

-- AlterTable
ALTER TABLE "audit_events" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "staff_auth_challenges" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "staff_invites" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "staff_mfa_methods" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "staff_recovery_codes" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "staff_sessions" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "staff_users" ALTER COLUMN "id" DROP DEFAULT;

-- CreateTable
CREATE TABLE "members" (
    "id" UUID NOT NULL,
    "supabase_user_id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "preferred_locale" TEXT NOT NULL DEFAULT 'en',
    "display_name" TEXT,
    "company" TEXT,
    "position" TEXT,
    "bio" TEXT,
    "city" TEXT,
    "country" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership_applications" (
    "id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "motivation" TEXT,
    "referral_source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "membership_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_supabase_user_id_key" ON "members"("supabase_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_phone_key" ON "members"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "membership_applications_member_id_key" ON "membership_applications"("member_id");

-- AddForeignKey
ALTER TABLE "staff_auth_challenges" ADD CONSTRAINT "staff_auth_challenges_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_credentials" ADD CONSTRAINT "staff_credentials_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_invites" ADD CONSTRAINT "staff_invites_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_mfa_methods" ADD CONSTRAINT "staff_mfa_methods_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_recovery_codes" ADD CONSTRAINT "staff_recovery_codes_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_sessions" ADD CONSTRAINT "staff_sessions_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_staff_id_fkey" FOREIGN KEY ("actor_staff_id") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_applications" ADD CONSTRAINT "membership_applications_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
