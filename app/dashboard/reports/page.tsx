import prisma from "@/lib/prisma";
import {Suspense} from "react";
import {ReportsPageClient} from "./ReportsPageClient";

async function getAvailableUnitIds() {
    const units = await prisma.unit.findMany({
        select: {
            unitCode: true
        },
        orderBy: {
            unitCode: "asc"
        }
    });

    return units.map((unit) => unit.unitCode);
}

export default async function ReportsPage() {
    const availableUnitIds = await getAvailableUnitIds();

    return (
        <Suspense fallback={null}>
            <ReportsPageClient availableUnitIds={availableUnitIds}/>
        </Suspense>
    );
}
