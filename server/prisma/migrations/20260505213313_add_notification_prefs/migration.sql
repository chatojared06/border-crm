-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notifyNewLeads" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyPipeline" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyWeekly" BOOLEAN NOT NULL DEFAULT false;
