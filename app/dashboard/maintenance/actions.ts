'use server';

import {Prisma} from "@/generated/prisma/client";
import {
    MaintenancePriority as PrismaMaintenancePriority,
    MaintenanceStatus as PrismaMaintenanceStatus,
    MaintenanceType as PrismaMaintenanceType
} from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import {MaintenanceItem} from "@/lib/types";
import {revalidatePath} from "next/cache";

interface CreateMaintenanceInput {
    unitId: string;
    reportId?: string | null;
    type: MaintenanceItem["type"];
    priority: MaintenanceItem["priority"];
    title: string;
    description?: string | null;
    scheduledFor: string;
    scheduledUntil?: string | null;
}

type CreateMaintenanceResult =
    | { ok: true }
    | { ok: false; error: string };

const typeToPrisma: Record<CreateMaintenanceInput["type"], PrismaMaintenanceType> = {
    Preventive: "PREVENTIVE",
    Corrective: "CORRECTIVE",
    Installation: "INSTALLATION",
    Inspection: "INSPECTION"
};

const priorityToPrisma: Record<CreateMaintenanceInput["priority"], PrismaMaintenancePriority> = {
    Low: "LOW",
    Medium: "MEDIUM",
    High: "HIGH"
};

function toNullableString(value?: string | null) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
}

function parseIsoDateTime(value: string, errorMessage: string) {
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return {
            ok: false as const,
            error: errorMessage
        };
    }

    return {
        ok: true as const,
        date: parsed
    };
}

export async function createMaintenance(input: CreateMaintenanceInput): Promise<CreateMaintenanceResult> {
    const unitId = input.unitId.trim();
    const reportId = input.reportId?.trim() || null;
    const title = input.title.trim();
    const description = toNullableString(input.description);

    if (!unitId) {
        return {ok: false, error: "Please select a unit."};
    }

    if (!title) {
        return {ok: false, error: "Please provide a title."};
    }

    const type = typeToPrisma[input.type];
    if (!type) {
        return {ok: false, error: "Please choose a valid maintenance type."};
    }

    const priority = priorityToPrisma[input.priority];
    if (!priority) {
        return {ok: false, error: "Please choose a valid priority."};
    }

    const startDateResult = parseIsoDateTime(input.scheduledFor, "Please provide a valid scheduled start date and time.");
    if (!startDateResult.ok) {
        return {
            ok: false,
            error: startDateResult.error
        };
    }

    const endDateInput = input.scheduledUntil?.trim();
    let scheduledUntil: Date | null = null;

    if (endDateInput) {
        const endDateResult = parseIsoDateTime(endDateInput, "Please provide a valid scheduled end date and time.");
        if (!endDateResult.ok) {
            return {
                ok: false,
                error: endDateResult.error
            };
        }

        if (endDateResult.date.getTime() < startDateResult.date.getTime()) {
            return {
                ok: false,
                error: "Scheduled end cannot be earlier than the scheduled start."
            };
        }

        scheduledUntil = endDateResult.date;
    }

    const unit = await prisma.unit.findUnique({
        where: {
            id: unitId
        },
        select: {
            id: true
        }
    });

    if (!unit) {
        return {
            ok: false,
            error: "The selected unit no longer exists. Please refresh and try again."
        };
    }

    if (reportId) {
        const report = await prisma.report.findUnique({
            where: {
                id: reportId
            },
            select: {
                id: true,
                unitId: true
            }
        });

        if (!report) {
            return {
                ok: false,
                error: "The selected report no longer exists. Please refresh and try again."
            };
        }

        if (report.unitId !== unit.id) {
            return {
                ok: false,
                error: "The selected report does not belong to the selected unit."
            };
        }
    }

    try {
        await prisma.maintenanceRecord.create({
            data: {
                unitId: unit.id,
                reportId,
                type,
                priority,
                status: PrismaMaintenanceStatus.SCHEDULED,
                title,
                description,
                outcome: null,
                scheduledFor: startDateResult.date,
                scheduledUntil,
                performedAt: null,
                performedById: null
            }
        });

        revalidatePath("/dashboard/maintenance");

        return {
            ok: true
        };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                ok: false,
                error: "We could not schedule this maintenance due to a database constraint. Please review the data and try again."
            };
        }

        return {
            ok: false,
            error: "We could not schedule maintenance right now. Please try again."
        };
    }
}
