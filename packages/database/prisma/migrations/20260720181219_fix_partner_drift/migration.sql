-- DropForeignKey
ALTER TABLE "partners" DROP CONSTRAINT "partners_owner_id_fkey";

-- AlterTable
ALTER TABLE "stripe_webhook_events" ALTER COLUMN "id" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
