'use server';

import prisma from "@/lib/prisma";
import {Prisma} from "@/generated/prisma/client";
import {UnitStatus as PrismaUnitStatusType} from "@/generated/prisma/enums";
import {DentalUnit, UnitStatus} from "@/lib/types";

interface CreateUnitInput {
    id: string;
    area: string;
    status: UnitStatus;
    observations?: string;
}

type CreateUnitResult =
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
            unit: {
                id: createdUnit.unitCode,
                number: parseUnitNumber(createdUnit.unitCode),
                area: createdUnit.area.displayName,
                status: statusFromPrisma[createdUnit.status] ?? "Operativa",
                lastReview: toIsoDate(createdUnit.lastReviewAt),
                brand: createdUnit.brand ?? undefined,
                model: createdUnit.model ?? undefined,
                serialNumber: createdUnit.serialNumber ?? undefined,
                installationDate: toIsoDate(createdUnit.installationDate),
                components: defaultComponents,
                observations: createdUnit.observations ?? undefined
            }
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