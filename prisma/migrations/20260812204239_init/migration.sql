-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPERVISOR', 'TECHNICIAN', 'CLINIC_STAFF');

-- CreateEnum
CREATE TYPE "AreaCode" AS ENUM ('ADULTS', 'ENDODONTICS', 'SURGERY', 'PEDIATRIC_DENTISTRY', 'ORTHODONTICS', 'PERIODONTICS');

-- CreateEnum
CREATE TYPE "UnitStatus" AS ENUM ('OPERATIONAL', 'PARTIALLY_OPERATIONAL', 'OUT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED');

-- CreateEnum
CREATE TYPE "ReportPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('PREVENTIVE', 'CORRECTIVE', 'INSTALLATION', 'INSPECTION');

-- CreateEnum
CREATE TYPE "MaintenanceOutcome" AS ENUM ('SCHEDULED', 'COMPLETED', 'PARTIAL', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "employeeCode" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CLINIC_STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL,
    "code" "AreaCode" NOT NULL,
    "displayName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "unitCode" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "status" "UnitStatus" NOT NULL,
    "lastReviewAt" TIMESTAMP(3),
    "brand" TEXT,
    "model" TEXT,
    "serialNumber" TEXT,
    "installationDate" TIMESTAMP(3),
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "legacyNumericId" INTEGER,
    "unitId" TEXT NOT NULL,
    "issueDescription" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "ReportPriority" NOT NULL DEFAULT 'MEDIUM',
    "reporterName" TEXT,
    "reporterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceRecord" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "reportId" TEXT,
    "type" "MaintenanceType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "outcome" "MaintenanceOutcome" NOT NULL,
    "scheduledFor" TIMESTAMP(3),
    "performedAt" TIMESTAMP(3),
    "performedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeCode_key" ON "User"("employeeCode");

-- CreateIndex
CREATE INDEX "User_fullName_idx" ON "User"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "Area_code_key" ON "Area"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_unitCode_key" ON "Unit"("unitCode");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_serialNumber_key" ON "Unit"("serialNumber");

-- CreateIndex
CREATE INDEX "Unit_areaId_status_idx" ON "Unit"("areaId", "status");

-- CreateIndex
CREATE INDEX "Unit_status_idx" ON "Unit"("status");

-- CreateIndex
CREATE INDEX "Unit_lastReviewAt_idx" ON "Unit"("lastReviewAt");

-- CreateIndex
CREATE INDEX "Unit_brand_model_idx" ON "Unit"("brand", "model");

-- CreateIndex
CREATE UNIQUE INDEX "Report_legacyNumericId_key" ON "Report"("legacyNumericId");

-- CreateIndex
CREATE INDEX "Report_unitId_status_idx" ON "Report"("unitId", "status");

-- CreateIndex
CREATE INDEX "Report_priority_status_idx" ON "Report"("priority", "status");

-- CreateIndex
CREATE INDEX "Report_createdAt_idx" ON "Report"("createdAt");

-- CreateIndex
CREATE INDEX "Report_reporterId_idx" ON "Report"("reporterId");

-- CreateIndex
CREATE INDEX "Report_status_closedAt_idx" ON "Report"("status", "closedAt");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_unitId_scheduledFor_idx" ON "MaintenanceRecord"("unitId", "scheduledFor");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_unitId_performedAt_idx" ON "MaintenanceRecord"("unitId", "performedAt");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_reportId_idx" ON "MaintenanceRecord"("reportId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_outcome_scheduledFor_idx" ON "MaintenanceRecord"("outcome", "scheduledFor");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_outcome_performedAt_idx" ON "MaintenanceRecord"("outcome", "performedAt");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_performedById_idx" ON "MaintenanceRecord"("performedById");

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
