/*
  Warnings:

  - You are about to drop the column `channel` on the `Event` table. All the data in the column will be lost.
  - Added the required column `origin` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Integration` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IntegrationSource" AS ENUM ('WEBSITE', 'APP');

-- CreateEnum
CREATE TYPE "EventOrigin" AS ENUM ('PIXEL_CLIENT', 'WEBHOOK_PROVIDER');

-- CreateEnum
CREATE TYPE "WebhookStatus" AS ENUM ('SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "channel",
ADD COLUMN     "contentCategory" TEXT,
ADD COLUMN     "contentIds" TEXT,
ADD COLUMN     "contentName" TEXT,
ADD COLUMN     "contentType" TEXT,
ADD COLUMN     "contents" TEXT,
ADD COLUMN     "cookieId" TEXT,
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "deviceType" TEXT,
ADD COLUMN     "documentEncoding" TEXT,
ADD COLUMN     "fbc" TEXT,
ADD COLUMN     "fbclid" TEXT,
ADD COLUMN     "fbp" TEXT,
ADD COLUMN     "funnelSlug" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "load_time_ms" TEXT,
ADD COLUMN     "origin" "EventOrigin" NOT NULL,
ADD COLUMN     "pageTitle" TEXT,
ADD COLUMN     "pathName" TEXT,
ADD COLUMN     "productSlug" TEXT,
ADD COLUMN     "referer" TEXT,
ADD COLUMN     "referrerUrl" TEXT,
ADD COLUMN     "screen_depth" TEXT,
ADD COLUMN     "screen_height" TEXT,
ADD COLUMN     "timezone_offset" TEXT,
ADD COLUMN     "urlFull" TEXT,
ADD COLUMN     "userAgent" TEXT,
ADD COLUMN     "userEmail" TEXT,
ADD COLUMN     "userLanguage" TEXT,
ADD COLUMN     "userName" TEXT,
ADD COLUMN     "userPhone" TEXT,
ADD COLUMN     "value" DOUBLE PRECISION,
ADD COLUMN     "webhookLogId" TEXT;

-- AlterTable
ALTER TABLE "Integration" ADD COLUMN     "funnelSlug" TEXT,
ADD COLUMN     "source" "IntegrationSource" NOT NULL;

-- DropEnum
DROP TYPE "EventChannel";

-- CreateTable
CREATE TABLE "WebhookLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "body" TEXT NOT NULL,
    "status" "WebhookStatus" NOT NULL,

    CONSTRAINT "WebhookLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_webhookLogId_fkey" FOREIGN KEY ("webhookLogId") REFERENCES "WebhookLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
