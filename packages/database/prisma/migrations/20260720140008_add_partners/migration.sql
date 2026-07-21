-- CreateEnum
CREATE TYPE "PartnerCategory" AS ENUM ('ADVISORY', 'FINANCE', 'LEGAL', 'TECHNOLOGY');

-- CreateEnum
CREATE TYPE "PartnerCountry" AS ENUM ('GERMANY', 'SWITZERLAND', 'POLAND', 'UKRAINE');

-- CreateTable
CREATE TABLE "partners" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "PartnerCategory" NOT NULL,
    "country" "PartnerCountry" NOT NULL,
    "discount_percent" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "translations" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partners_slug_key" ON "partners"("slug");
