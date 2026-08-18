import {
    ReportPriority as PrismaReportPriorityType,
    ReportStatus as PrismaReportStatusType,
    UnitStatus as PrismaUnitStatus
} from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import {DashboardPageClient} from "./DashboardPageClient";
import {UnitStats} from "@/app/dashboard/components/globals/StatsRow";
import {Report} from "@/lib/types";

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

async function getUnitStats(): Promise<UnitStats> {
    const [total, functional, partial, nonFunctional] = await Promise.all([
        prisma.unit.count(),
        prisma.unit.count({where: {status: PrismaUnitStatus.OPERATIONAL}}),
        prisma.unit.count({where: {status: PrismaUnitStatus.PARTIALLY_OPERATIONAL}}),
        prisma.unit.count({where: {status: PrismaUnitStatus.OUT_OF_SERVICE}})
    ]);

    return {
        total,
        functional,
        partial,
        nonFunctional
    };
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

export default async function DashBoard() {
    const [unitStats, reports] = await Promise.all([getUnitStats(), getReports()]);

    return <DashboardPageClient unitStats={unitStats} initialReports={reports}/>;
}
