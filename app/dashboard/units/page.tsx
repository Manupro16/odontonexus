import prisma from "@/lib/prisma";
import {DentalUnit, UnitStatus} from "@/lib/types";
import {UnitsPageClient} from "./UnitsPageClient";

const statusMapping: Record<string, UnitStatus> = {
    OPERATIONAL: "Operativa",
    PARTIALLY_OPERATIONAL: "Parcialmente Operativa",
    OUT_OF_SERVICE: "Fuera de Servicio"
};

const defaultComponents: DentalUnit["components"] = {
    chair: true,
    lamp: true,
    tripleSyringe: true,
    pedal: true,
    suction: true,
    micromotor: true,
    highSpeed: true
};

function toIsoDate(date: Date | null) {
    return date ? date.toISOString().slice(0, 10) : "";
}

function parseUnitNumber(unitCode: string) {
    const parsed = Number.parseInt(unitCode.replace(/\D/g, ""), 10);
    return Number.isNaN(parsed) ? 0 : parsed;
}

async function getUnitsPageData(): Promise<DentalUnit[]> {
    const units = await prisma.unit.findMany({
        include: {
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
        id: unit.unitCode,
        number: parseUnitNumber(unit.unitCode),
        area: unit.area.displayName,
        status: statusMapping[unit.status] ?? "Operativa",
        lastReview: toIsoDate(unit.lastReviewAt),
        brand: unit.brand ?? undefined,
        model: unit.model ?? undefined,
        serialNumber: unit.serialNumber ?? undefined,
        installationDate: toIsoDate(unit.installationDate),
        components: defaultComponents,
        observations: unit.observations ?? undefined
    }));
}

export default async function UnitsPage() {
    const initialUnits = await getUnitsPageData();

    return <UnitsPageClient initialUnits={initialUnits} />;
}
