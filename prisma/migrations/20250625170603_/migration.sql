-- CreateEnum
CREATE TYPE "IntegrationProvider" AS ENUM ('FACEBOOK');

-- CreateEnum
CREATE TYPE "EventName" AS ENUM ('INIT_PAGE', 'VIEW_CONTENT', 'INITIATE_CHECKOUT', 'PURCHASE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "EventChannel" AS ENUM ('PIXEL_CLIENT', 'WEBHOOK_PROVIDER');

-- CreateTable
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "provider" "IntegrationProvider" NOT NULL,
    "pixelId" TEXT,
    "accessToken" TEXT,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dedupKey" TEXT NOT NULL,
    "eventTime" TIMESTAMP(3) NOT NULL,
    "traceId" TEXT,
    "name" "EventName" NOT NULL,
    "status" "EventStatus" NOT NULL,
    "channel" "EventChannel" NOT NULL,
    "integrationId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
