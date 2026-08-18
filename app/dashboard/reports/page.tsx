import prisma from "@/lib/prisma";
import {Suspense} from "react";
import {ReportsPageClient} from "./ReportsPageClient";
import {Report, ReportUnitOption} from "@/lib/types";
import {ReportPriority as PrismaReportPriorityType, ReportStatus as PrismaReportStatusType} from "@/generated/prisma/enums";

const priorityFromPrisma: Record<PrismaReportPriorityType, Report["priority"]> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High"
};

const statusFromPrisma: Record<PrismaReportStatusType, Report["status"]> = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    CLOSED: "Closed"
};

const priorityToColor: Record<Report["priority"], Report["priorityColor"]> = {
    High: "red",
    Medium: "orange",
    Low: "green"
};

function toIsoDate(date: Date) {
    return date.toISOString().slice(0, 10);
}

async function getReports(): Promise<Report[]> {
    const reports = await prisma.report.findMany({
        include: {
            unit: {
                select: {
                    unitCode: true,
                    area: {
                        select: {
                            displayName: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return reports.map((report) => {
        const priority = priorityFromPrisma[report.priority];

        return {
            id: report.id,
            unit: report.unit.unitCode,
            issue: report.issueDescription,
            area: report.unit.area.displayName,
            status: statusFromPrisma[report.status],
            priority,
            priorityColor: priorityToColor[priority],
            createdAt: toIsoDate(report.createdAt),
            reporter: report.reporterName ?? "Unknown"
        };
    });
}

async function getAvailableUnits(): Promise<ReportUnitOption[]> {
    const units = await prisma.unit.findMany({
        select: {
            unitCode: true,
            area: {
                select: {
                    displayName: true
                }
            }
        },
        orderBy: {
            unitCode: "asc"
        }
    });

    return units.map((unit) => ({
        unitCode: unit.unitCode,
        area: unit.area.displayName
    }));
}

export default async function ReportsPage() {
    const availableUnits = await getAvailableUnits();
    const reports = await getReports();

    return (
        <Suspense fallback={null}>
            <ReportsPageClient availableUnits={availableUnits} initialReports={reports}/>
        </Suspense>
    );
}
