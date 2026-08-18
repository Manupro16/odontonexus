'use server';

import prisma from "@/lib/prisma";
import {Prisma} from "@/generated/prisma/client";
import {UnitStatus as PrismaUnitStatusType} from "@/generated/prisma/enums";
import {DentalUnit, UnitStatus} from "@/lib/types";
import {revalidatePath} from "next/cache";

interface CreateUnitInput {
    id: string;
    area: string;
    status: UnitStatus;
    observations?: string;
}

type CreateUnitResult =
    | { ok: true; unit: DentalUnit }
    | { ok: false; error: string };

interface UpdateUnitStatusInput {
    id: string;
    status: UnitStatus;
}

interface UpdateUnitReviewInput {
    updates: UpdateUnitStatusInput[];
}

type UpdateUnitReviewResult =
    | { ok: true; units: DentalUnit[] }
    | { ok: false; error: string };

interface UpdateUnitMetadataInput {
    id: string;
    area: string;
    status: UnitStatus;
    brand?: string;
    model?: string;
    serialNumber?: string;
    installationDate?: string;
    observations?: string;
}

type UpdateUnitMetadataResult =
    | { ok: true; unit: DentalUnit }
    | { ok: false; error: string };

const defaultComponents: DentalUnit["components"] = {
    chair: true,
    lamp: true,
    tripleSyringe: true,
    pedal: true,
    suction: true,
    micromotor: true,
    highSpeed: true
};

const statusToPrisma: Record<UnitStatus, PrismaUnitStatusType> = {
    Operativa: "OPERATIONAL",
    "Parcialmente Operativa": "PARTIALLY_OPERATIONAL",
    "Fuera de Servicio": "OUT_OF_SERVICE"
};

const statusFromPrisma: Record<PrismaUnitStatusType, UnitStatus> = {
    OPERATIONAL: "Operativa",
    PARTIALLY_OPERATIONAL: "Parcialmente Operativa",
    OUT_OF_SERVICE: "Fuera de Servicio"
};

function toIsoDate(date: Date | null) {
    return date ? date.toISOString().slice(0, 10) : "";
}

function parseUnitNumber(unitCode: string) {
    const parsed = Number.parseInt(unitCode.replace(/\D/g, ""), 10);
    return Number.isNaN(parsed) ? 0 : parsed;
}

function toNullableString(value?: string) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
}

function parseInstallationDate(value?: string) {
    const trimmed = value?.trim();
    if (!trimmed) {
        return {
            ok: true as const,
            value: null
        };
    }

    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) {
        return {
            ok: false as const,
            error: "Please provide a valid installation date."
        };
    }

    return {
        ok: true as const,
        value: parsed
    };
}

function toDentalUnit(unit: {
    unitCode: string;
    status: PrismaUnitStatusType;
    lastReviewAt: Date | null;
    brand: string | null;
    model: string | null;
    serialNumber: string | null;
    installationDate: Date | null;
    observations: string | null;
    area: {
        displayName: string;
    };
}): DentalUnit {
    return {
        id: unit.unitCode,
        number: parseUnitNumber(unit.unitCode),
        area: unit.area.displayName,
        status: statusFromPrisma[unit.status] ?? "Operativa",
        lastReview: toIsoDate(unit.lastReviewAt),
        brand: unit.brand ?? undefined,
        model: unit.model ?? undefined,
        serialNumber: unit.serialNumber ?? undefined,
        installationDate: toIsoDate(unit.installationDate),
        components: defaultComponents,
        observations: unit.observations ?? undefined
    };
}

export async function createUnit(input: CreateUnitInput): Promise<CreateUnitResult> {
    const unitCode = input.id.trim();
    const areaName = input.area.trim();
    const observations = input.observations?.trim() || null;

    if (!unitCode || !areaName) {
        return {ok: false, error: "Please complete all required fields."};
    }

    const prismaStatus = statusToPrisma[input.status];
    if (!prismaStatus) {
        return {ok: false, error: "Invalid unit status."};
    }

    const area = await prisma.area.findFirst({
        where: {
            displayName: areaName,
            isActive: true
        },
        select: {
            id: true,
            displayName: true
        }
    });

    if (!area) {
        return {ok: false, error: "The selected area is not available."};
    }

    try {
        const createdUnit = await prisma.unit.create({
            data: {
                unitCode,
                areaId: area.id,
                status: prismaStatus,
                observations
            },
            include: {
                area: {
                    select: {
                        displayName: true
                    }
                }
            }
        });

        return {
            ok: true,
            unit: toDentalUnit(createdUnit)
        };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            const target = Array.isArray(error.meta?.target) ? error.meta.target : [];
            if (target.includes("unitCode")) {
                return {ok: false, error: "This Unit ID already exists."};
            }
        }

        return {ok: false, error: "We could not create the unit right now. Please try again."};
    }
}

export async function updateUnitReview(input: UpdateUnitReviewInput): Promise<UpdateUnitReviewResult> {
    if (!Array.isArray(input.updates) || input.updates.length === 0) {
        return {ok: false, error: "No unit changes were provided."};
    }

    const normalizedUpdates = input.updates.map((update) => ({
        id: update.id.trim(),
        status: update.status
    }));

    if (normalizedUpdates.some((update) => !update.id)) {
        return {ok: false, error: "One or more units are missing an ID."};
    }

    const updateByUnitCode = new Map<string, PrismaUnitStatusType>();
    for (const update of normalizedUpdates) {
        const prismaStatus = statusToPrisma[update.status];
        if (!prismaStatus) {
            return {ok: false, error: "One of the selected statuses is invalid."};
        }

        updateByUnitCode.set(update.id, prismaStatus);
    }

    const unitCodes = Array.from(updateByUnitCode.keys());

    const existingUnits = await prisma.unit.findMany({
        where: {
            unitCode: {
                in: unitCodes
            }
        },
        select: {
            unitCode: true
        }
    });

    if (existingUnits.length !== unitCodes.length) {
        return {
            ok: false,
            error: "One or more units no longer exist. Please refresh and try again."
        };
    }

    const reviewedAt = new Date();

    try {
        const updatedUnits = await prisma.$transaction(
            unitCodes.map((unitCode) => prisma.unit.update({
                where: {
                    unitCode
                },
                data: {
                    status: updateByUnitCode.get(unitCode)!,
                    lastReviewAt: reviewedAt
                },
                include: {
                    area: {
                        select: {
                            displayName: true
                        }
                    }
                }
            }))
        );

        revalidatePath("/dashboard/units");
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/reports");

        return {
            ok: true,
            units: updatedUnits.map(toDentalUnit)
        };
    } catch {
        return {
            ok: false,
            error: "We could not save the unit review right now. Please try again."
        };
    }
}

export async function updateUnitMetadata(input: UpdateUnitMetadataInput): Promise<UpdateUnitMetadataResult> {
    const unitCode = input.id.trim();
    const areaName = input.area.trim();
    const brand = toNullableString(input.brand);
    const model = toNullableString(input.model);
    const serialNumber = toNullableString(input.serialNumber);
    const observations = toNullableString(input.observations);

    if (!unitCode || !areaName) {
        return {ok: false, error: "Please complete all required fields."};
    }

    const prismaStatus = statusToPrisma[input.status];
    if (!prismaStatus) {
        return {ok: false, error: "Invalid unit status."};
    }

    const parsedInstallationDate = parseInstallationDate(input.installationDate);
    if (!parsedInstallationDate.ok) {
        return {ok: false, error: parsedInstallationDate.error};
    }

    const existingUnit = await prisma.unit.findUnique({
        where: {
            unitCode
        },
        select: {
            id: true
        }
    });

    if (!existingUnit) {
        return {
            ok: false,
            error: "This unit no longer exists. Please refresh and try again."
        };
    }

    const area = await prisma.area.findFirst({
        where: {
            displayName: areaName,
            isActive: true
        },
        select: {
            id: true
        }
    });

    if (!area) {
        return {ok: false, error: "The selected area is not available."};
    }

    try {
        const updatedUnit = await prisma.unit.update({
            where: {
                unitCode
            },
            data: {
                areaId: area.id,
                status: prismaStatus,
                brand,
                model,
                serialNumber,
                installationDate: parsedInstallationDate.value,
                observations
            },
            include: {
                area: {
                    select: {
                        displayName: true
                    }
                }
            }
        });

        revalidatePath("/dashboard/units");
        revalidatePath(`/dashboard/units/${unitCode}`);
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/reports");

        return {
            ok: true,
            unit: toDentalUnit(updatedUnit)
        };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                const target = Array.isArray(error.meta?.target) ? error.meta.target : [];
                if (target.includes("serialNumber")) {
                    return {ok: false, error: "This serial number is already assigned to another unit."};
                }
            }

            if (error.code === "P2025") {
                return {
                    ok: false,
                    error: "This unit no longer exists. Please refresh and try again."
                };
            }
        }

        return {ok: false, error: "We could not update the unit right now. Please try again."};
    }
}