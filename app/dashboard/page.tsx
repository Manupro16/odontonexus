import {UnitStatus as PrismaUnitStatus} from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import {DashboardPageClient} from "./DashboardPageClient";
import {UnitStats} from "@/app/dashboard/components/globals/StatsRow";

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

export default async function DashBoard() {
    const unitStats = await getUnitStats();

    return <DashboardPageClient unitStats={unitStats}/>;
}
