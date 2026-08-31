-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MaintenancePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "MaintenanceOutcome_new" AS ENUM ('COMPLETED', 'PARTIAL', 'FAILED');

-- AlterTable
ALTER TABLE "MaintenanceRecord"
  ADD COLUMN "status" "MaintenanceStatus" NOT NULL DEFAULT 'SCHEDULED',
  ADD COLUMN "priority" "MaintenancePriority" NOT NULL DEFAULT 'MEDIUM',
  ADD COLUMN "scheduledUntil" TIMESTAMP(3),
  ADD COLUMN "outcome_new" "MaintenanceOutcome_new";

-- Data migration: split status from outcome
UPDATE "MaintenanceRecord"
SET
  "status" = CASE
    WHEN "outcome" = 'SCHEDULED' THEN 'SCHEDULED'::"MaintenanceStatus"
    ELSE 'COMPLETED'::"MaintenanceStatus"
  END,
  "outcome_new" = CASE
    WHEN "outcome" = 'SCHEDULED' THEN NULL
    WHEN "outcome" = 'COMPLETED' THEN 'COMPLETED'::"MaintenanceOutcome_new"
    WHEN "outcome" = 'PARTIAL' THEN 'PARTIAL'::"MaintenanceOutcome_new"
    WHEN "outcome" = 'FAILED' THEN 'FAILED'::"MaintenanceOutcome_new"
  END;

-- Replace outcome enum/column to remove SCHEDULED from outcome domain
ALTER TABLE "MaintenanceRecord" DROP COLUMN "outcome";
ALTER TABLE "MaintenanceRecord" RENAME COLUMN "outcome_new" TO "outcome";
ALTER TYPE "MaintenanceOutcome" RENAME TO "MaintenanceOutcome_old";
ALTER TYPE "MaintenanceOutcome_new" RENAME TO "MaintenanceOutcome";
DROP TYPE "MaintenanceOutcome_old";

-- Keep calendar ranges consistent when both values exist
ALTER TABLE "MaintenanceRecord"
  ADD CONSTRAINT "MaintenanceRecord_scheduledUntil_after_scheduledFor_chk"
  CHECK (
    "scheduledUntil" IS NULL
    OR "scheduledFor" IS NULL
    OR "scheduledUntil" >= "scheduledFor"
  );

-- Drop obsolete indexes
DROP INDEX "MaintenanceRecord_unitId_scheduledFor_idx";
DROP INDEX "MaintenanceRecord_outcome_scheduledFor_idx";
DROP INDEX "MaintenanceRecord_outcome_performedAt_idx";

-- CreateIndex
CREATE INDEX "MaintenanceRecord_unitId_status_scheduledFor_idx"
  ON "MaintenanceRecord"("unitId", "status", "scheduledFor");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_status_scheduledFor_idx"
  ON "MaintenanceRecord"("status", "scheduledFor");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_status_scheduledUntil_idx"
  ON "MaintenanceRecord"("status", "scheduledUntil");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_outcome_performedAt_idx"
  ON "MaintenanceRecord"("outcome", "performedAt");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_priority_status_idx"
  ON "MaintenanceRecord"("priority", "status");