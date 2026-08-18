'use server';

import prisma from "@/lib/prisma";
import {Prisma} from "@/generated/prisma/client";
import {ReportPriority as PrismaReportPriorityType} from "@/generated/prisma/enums";
import {revalidatePath} from "next/cache";
import {Report} from "@/lib/types";

interface CreateReportInput {
    unit: string;
    issue: string;
    area?: string;
    priority: "Low" | "Medium" | "High";
    reporter?: string;
}

type CreateReportResult =
    | { ok: true; report: Report }
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

        const report: Report = {
            id: created.id,
            unit: created.unit.unitCode,
            issue: created.issueDescription,
            area: created.unit.area.displayName,
            status: "Open",
            priority: priorityFromPrisma[created.priority],
            priorityColor: priorityToColor[priorityFromPrisma[created.priority]],
            createdAt: toIsoDate(created.createdAt),
            reporter: created.reporterName ?? "Unknown"
        };

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