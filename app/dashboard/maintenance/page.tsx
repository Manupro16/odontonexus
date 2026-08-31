import {
    MaintenanceOutcome as PrismaMaintenanceOutcome,
    MaintenancePriority as PrismaMaintenancePriority,
    MaintenanceStatus as PrismaMaintenanceStatus,
    MaintenanceType as PrismaMaintenanceType,
    ReportStatus as PrismaReportStatus
} from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import {MaintenanceItem} from "@/lib/types";
import {MaintenancePageClient} from "./MaintenancePageClient";

const maintenanceTypeFromPrisma: Record<PrismaMaintenanceType, MaintenanceItem["type"]> = {
    PREVENTIVE: "Preventive",
    CORRECTIVE: "Corrective",
    INSTALLATION: "Installation",
    INSPECTION: "Inspection"
};

const maintenanceStatusFromPrisma: Record<PrismaMaintenanceStatus, MaintenanceItem["status"]> = {
    SCHEDULED: "Scheduled",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled"
};

const maintenancePriorityFromPrisma: Record<PrismaMaintenancePriority, MaintenanceItem["priority"]> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High"
};

const maintenanceOutcomeFromPrisma: Record<PrismaMaintenanceOutcome, Exclude<MaintenanceItem["outcome"], null>> = {
    COMPLETED: "Completed",
    PARTIAL: "Partial",
    FAILED: "Failed"
};

const reportStatusFromPrisma: Record<PrismaReportStatus, NonNullable<MaintenanceItem["relatedReport"]>["status"]> = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    CLOSED: "Closed"
};

function toIsoDateTime(date: Date | null): string | null {
    return date ? date.toISOString() : null;
}

async function getMaintenanceItems(): Promise<MaintenanceItem[]> {
    const records = await prisma.maintenanceRecord.findMany({
        include: {
            unit: {
                select: {
                    id: true,
                    unitCode: true,
                    area: {
                        select: {
                            displayName: true
                        }
                    }
                }
            },
            report: {
                select: {
                    id: true,
                    issueDescription: true,
                    status: true
                }
            },
            performedBy: {
                select: {
                    fullName: true
                }
            }
        },
        orderBy: [
            {scheduledFor: "asc"},
            {scheduledUntil: "asc"},
            {createdAt: "asc"}
        ]
    });

    return records.map((record) => ({
        id: record.id,
        unitId: record.unit.id,
        unitCode: record.unit.unitCode,
        area: record.unit.area.displayName,
        type: maintenanceTypeFromPrisma[record.type],
        status: maintenanceStatusFromPrisma[record.status],
        priority: maintenancePriorityFromPrisma[record.priority],
        outcome: record.outcome ? maintenanceOutcomeFromPrisma[record.outcome] : null,
        title: record.title,
        description: record.description,
        scheduledFor: toIsoDateTime(record.scheduledFor),
        scheduledUntil: toIsoDateTime(record.scheduledUntil),
        performedAt: toIsoDateTime(record.performedAt),
        performedBy: record.performedBy?.fullName ?? null,
        relatedReport: record.report
            ? {
                id: record.report.id,
                issue: record.report.issueDescription,
                status: reportStatusFromPrisma[record.report.status]
            }
            : null
    }));
}

export default async function MaintenancePage() {
    const maintenanceItems = await getMaintenanceItems();

    return <MaintenancePageClient initialMaintenanceItems={maintenanceItems}/>;
}
