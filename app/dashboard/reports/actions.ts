'use server';

import prisma from "@/lib/prisma";
import {Prisma} from "@/generated/prisma/client";
import {ReportPriority as PrismaReportPriorityType, ReportStatus as PrismaReportStatusType} from "@/generated/prisma/enums";
import {revalidatePath} from "next/cache";
import {Report} from "@/lib/types";

interface CreateReportInput {
    unit: string;
    issue: string;
    priority: "Low" | "Medium" | "High";
    reporter?: string;
}

type CreateReportResult =
    | { ok: true; report: Report }
    | { ok: false; error: string };

interface ReportStatusUpdateInput {
    id: string;
    status: Report["status"];
}

interface UpdateReportStatusesInput {
    updates: ReportStatusUpdateInput[];
}

type UpdateReportStatusesResult =
    | { ok: true; reports: Report[] }
    | { ok: false; error: string };

const priorityToPrisma: Record<CreateReportInput["priority"], PrismaReportPriorityType> = {
    Low: "LOW",
    Medium: "MEDIUM",
    High: "HIGH"
};

const priorityFromPrisma: Record<PrismaReportPriorityType, Report["priority"]> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High"
};

const statusToPrisma: Record<Report["status"], PrismaReportStatusType> = {
    Open: "OPEN",
    "In Progress": "IN_PROGRESS",
    Closed: "CLOSED"
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

function toNullableString(value?: string) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
}

function mapReportRecordToClient(report: {
    id: string;
    issueDescription: string;
    status: PrismaReportStatusType;
    priority: PrismaReportPriorityType;
    createdAt: Date;
    closedAt: Date | null;
    reporterName: string | null;
    unit: {
        unitCode: string;
        area: {
            displayName: string;
        };
    };
}): Report {
    const mappedPriority = priorityFromPrisma[report.priority];

    return {
        id: report.id,
        unit: report.unit.unitCode,
        issue: report.issueDescription,
        area: report.unit.area.displayName,
        status: statusFromPrisma[report.status],
        priority: mappedPriority,
        priorityColor: priorityToColor[mappedPriority],
        createdAt: toIsoDate(report.createdAt),
        closedAt: report.closedAt?.toISOString() ?? null,
        reporter: report.reporterName ?? "Unknown"
    };
}

class MissingReportsError extends Error {
    missingIds: string[];

    constructor(missingIds: string[]) {
        super("Missing reports");
        this.missingIds = missingIds;
    }
}

function buildMissingReportErrorMessage(missingIds: string[]) {
    if (missingIds.length === 1) {
        return "One report no longer exists. Please refresh and try again.";
    }

    return "Some reports no longer exist. Please refresh and try again.";
}

function normalizeStatusUpdates(updates: ReportStatusUpdateInput[]) {
    if (!Array.isArray(updates)) {
        return {
            ok: false as const,
            error: "The submitted status changes are invalid. Please refresh and try again."
        };
    }

    const updatesById = new Map<string, PrismaReportStatusType>();

    for (const update of updates) {
        if (!update || typeof update.id !== "string" || typeof update.status !== "string") {
            return {
                ok: false as const,
                error: "One of the selected reports has invalid data. Please refresh and try again."
            };
        }

        const id = update.id.trim();
        if (!id) {
            return {
                ok: false as const,
                error: "One of the selected reports has an invalid ID. Please refresh and try again."
            };
        }

        const nextStatus = statusToPrisma[update.status];
        if (!nextStatus) {
            return {
                ok: false as const,
                error: "One of the selected reports has an invalid status. Please refresh and try again."
            };
        }

        updatesById.set(id, nextStatus);
    }

    if (updatesById.size === 0) {
        return {
            ok: false as const,
            error: "There are no report status changes to save."
        };
    }

    return {
        ok: true as const,
        updatesById
    };
}

export async function createReport(input: CreateReportInput): Promise<CreateReportResult> {
    const unitCode = input.unit.trim();
    const issueDescription = input.issue.trim();

    if (!unitCode) {
        return {ok: false, error: "Please select a unit."};
    }

    if (!issueDescription) {
        return {ok: false, error: "Please provide the issue description."};
    }

    const priority = priorityToPrisma[input.priority];
    if (!priority) {
        return {ok: false, error: "Please choose a valid priority."};
    }

    const unit = await prisma.unit.findUnique({
        where: {
            unitCode
        },
        include: {
            area: {
                select: {
                    displayName: true
                }
            }
        }
    });

    if (!unit) {
        return {
            ok: false,
            error: "The selected unit no longer exists. Please refresh and try again."
        };
    }

    try {
        const created = await prisma.report.create({
            data: {
                unitId: unit.id,
                issueDescription,
                priority,
                reporterName: toNullableString(input.reporter) ?? "Unknown"
            },
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
            }
        });

        const report = mapReportRecordToClient(created);

        revalidatePath("/dashboard/reports");
        revalidatePath("/dashboard");

        return {
            ok: true,
            report
        };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                ok: false,
                error: "We could not create the report due to a database constraint. Please review the data and try again."
            };
        }

        return {
            ok: false,
            error: "We could not create the report right now. Please try again."
        };
    }
}

export async function updateReportStatuses(input: UpdateReportStatusesInput): Promise<UpdateReportStatusesResult> {
    const normalized = normalizeStatusUpdates(input.updates);
    if (!normalized.ok) {
        return normalized;
    }

    const reportIds = Array.from(normalized.updatesById.keys());

    try {
        const updatedReports = await prisma.$transaction(async (tx) => {
            const existingReports = await tx.report.findMany({
                where: {
                    id: {
                        in: reportIds
                    }
                },
                select: {
                    id: true,
                    status: true,
                    closedAt: true
                }
            });

            if (existingReports.length !== reportIds.length) {
                const existingIds = new Set(existingReports.map((report) => report.id));
                const missingIds = reportIds.filter((id) => !existingIds.has(id));
                throw new MissingReportsError(missingIds);
            }

            const existingById = new Map(existingReports.map((report) => [report.id, report]));
            const now = new Date();

            for (const reportId of reportIds) {
                const current = existingById.get(reportId);
                const nextStatus = normalized.updatesById.get(reportId);

                if (!current || !nextStatus) {
                    throw new MissingReportsError([reportId]);
                }

                await tx.report.update({
                    where: {
                        id: reportId
                    },
                    data: {
                        status: nextStatus,
                        closedAt: nextStatus === "CLOSED"
                            ? (current.closedAt ?? now)
                            : null
                    }
                });
            }

            return tx.report.findMany({
                where: {
                    id: {
                        in: reportIds
                    }
                },
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
                }
            });
        });

        const reportOrder = new Map(reportIds.map((id, index) => [id, index]));
        const reports = updatedReports
            .sort((a, b) => (reportOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (reportOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER))
            .map(mapReportRecordToClient);

        revalidatePath("/dashboard/reports");
        revalidatePath("/dashboard");

        return {
            ok: true,
            reports
        };
    } catch (error) {
        if (error instanceof MissingReportsError) {
            return {
                ok: false,
                error: buildMissingReportErrorMessage(error.missingIds)
            };
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return {
                ok: false,
                error: "One or more reports no longer exist. Please refresh and try again."
            };
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                ok: false,
                error: "We could not save report status changes due to a database constraint. Please review your changes and try again."
            };
        }

        return {
            ok: false,
            error: "We could not save report status changes right now. Please try again."
        };
    }
}