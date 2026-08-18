import prisma from "@/lib/prisma";
import {UnitDetailView} from "@/app/dashboard/components/units/UnitDetailView";
import {Button, Flex, Text} from "@radix-ui/themes";
import Link from "next/link";
import {ArrowLeftIcon} from "@radix-ui/react-icons";
import {DentalUnit, UnitStatus} from "@/lib/types";

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


interface UnitDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function UnitDetailPage({params}: UnitDetailPageProps) {
    const { id } = await params;

    const availableAreas = await prisma.area.findMany({
        where: {
            isActive: true
        },
        select: {
            displayName: true
        },
        orderBy: {
            displayName: "asc"
        }
    });

    const unitRecord = await prisma.unit.findUnique({
        where: {
            unitCode: id
        },
        include: {
            area: {
                select: {
                    displayName: true
                }
            }
        }
    });

    if (!unitRecord) {
        return (
            <Flex direction="column" align="center" justify="center" py="9" gap="4">
                <Text size="5" weight="bold">Unit Not Found</Text>
                <Text color="gray">The dental unit with ID &#34;{id}&#34; could not be located in our system.</Text>
                <Button asChild variant="soft" color="gray">
                    <Link href="/dashboard/units">
                        <ArrowLeftIcon /> Back to Units
                    </Link>
                </Button>
            </Flex>
        );
    }

    const unit: DentalUnit = {
        id: unitRecord.unitCode,
        number: Number.parseInt(unitRecord.unitCode.replace(/\D/g, ""), 10) || 0,
        area: unitRecord.area.displayName,
        status: statusMapping[unitRecord.status] ?? "Operativa",
        lastReview: toIsoDate(unitRecord.lastReviewAt),
        brand: unitRecord.brand ?? undefined,
        model: unitRecord.model ?? undefined,
        serialNumber: unitRecord.serialNumber ?? undefined,
        installationDate: toIsoDate(unitRecord.installationDate),
        components: defaultComponents,
        observations: unitRecord.observations ?? undefined
    };

    return <UnitDetailView unit={unit} availableAreas={availableAreas.map((area) => area.displayName)} />;
}
