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

interface UpdateMaintenanceInput extends CreateMaintenanceInput {
    id: string;
}

type MaintenanceActionResult =
    | { ok: true }
    | { ok: false; error: string };

interface NormalizedMaintenanceInput {
    unitId: string;
    reportId: string | null;
    type: PrismaMaintenanceType;
    priority: PrismaMaintenancePriority;
    title: string;
    description: string | null;
    scheduledFor: Date;
    scheduledUntil: Date | null;
}

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

const editableStatuses = new Set<PrismaMaintenanceStatus>([
    PrismaMaintenanceStatus.SCHEDULED,
    PrismaMaintenanceStatus.IN_PROGRESS
]);

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

async function validateAndNormalizeMaintenanceInput(input: CreateMaintenanceInput): Promise<
    | {ok: true; value: NormalizedMaintenanceInput}
    | {ok: false; error: string}
> {
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

    return {
        ok: true,
        value: {
            unitId: unit.id,
            reportId,
            type,
            priority,
            title,
            description,
            scheduledFor: startDateResult.date,
            scheduledUntil
        }
    };
}

export async function createMaintenance(input: CreateMaintenanceInput): Promise<MaintenanceActionResult> {
    const normalizedResult = await validateAndNormalizeMaintenanceInput(input);

    if (!normalizedResult.ok) {
        return normalizedResult;
    }

    try {
        await prisma.maintenanceRecord.create({
            data: {
                unitId: normalizedResult.value.unitId,
                reportId: normalizedResult.value.reportId,
                type: normalizedResult.value.type,
                priority: normalizedResult.value.priority,
                status: PrismaMaintenanceStatus.SCHEDULED,
                title: normalizedResult.value.title,
                description: normalizedResult.value.description,
                outcome: null,
                scheduledFor: normalizedResult.value.scheduledFor,
                scheduledUntil: normalizedResult.value.scheduledUntil,
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

export async function updateMaintenance(input: UpdateMaintenanceInput): Promise<MaintenanceActionResult> {
    const maintenanceId = input.id.trim();

    if (!maintenanceId) {
        return {
            ok: false,
            error: "The selected maintenance record no longer exists. Please refresh and try again."
        };
    }

    const existingRecord = await prisma.maintenanceRecord.findUnique({
        where: {
            id: maintenanceId
        },
        select: {
            id: true,
            status: true
        }
    });

    if (!existingRecord) {
        return {
            ok: false,
            error: "The selected maintenance record no longer exists. Please refresh and try again."
        };
    }

    if (!editableStatuses.has(existingRecord.status)) {
        return {
            ok: false,
            error: "Completed and cancelled maintenance records are read-only and cannot be rescheduled."
        };
    }

    const normalizedResult = await validateAndNormalizeMaintenanceInput(input);

    if (!normalizedResult.ok) {
        return normalizedResult;
    }

    try {
        await prisma.maintenanceRecord.update({
            where: {
                id: existingRecord.id
            },
            data: {
                unitId: normalizedResult.value.unitId,
                reportId: normalizedResult.value.reportId,
                type: normalizedResult.value.type,
                priority: normalizedResult.value.priority,
                title: normalizedResult.value.title,
                description: normalizedResult.value.description,
                scheduledFor: normalizedResult.value.scheduledFor,
                scheduledUntil: normalizedResult.value.scheduledUntil
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
                error: "We could not update this maintenance due to a database constraint. Please review the data and try again."
            };
        }

        return {
            ok: false,
            error: "We could not update maintenance right now. Please try again."
        };
    }
}
