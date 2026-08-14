'use client'

import {Button, Flex, Grid, Heading, Text, Box} from "@radix-ui/themes";
import {useUnitsPageController} from "../hooks/useUnitsPageController";
import {UnitCard} from "@/app/dashboard/components/units/UnitCard";
import {UnitFilters} from "@/app/dashboard/components/units/UnitFilters";
import {PlusIcon} from "@radix-ui/react-icons";
import {CreateUnitDialog, CreateUnitPayload} from "@/app/dashboard/components/units/CreateUnitDialog";
import {useMemo, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {DentalUnit} from "@/lib/types";
import {createUnit} from "./actions";

interface UnitsPageClientProps {
    initialUnits: DentalUnit[];
}

export function UnitsPageClient({initialUnits}: UnitsPageClientProps) {
    const [isManualCreateDialogOpen, setIsManualCreateDialogOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const shouldAutoOpenCreateDialog = searchParams.get("create") === "true";
    const isCreateDialogOpen = isManualCreateDialogOpen || shouldAutoOpenCreateDialog;

    const {
        searchQuery,
        setSearchQuery,
        areaFilter,
        setAreaFilter,
        statusFilter,
        setStatusFilter,
        filteredUnits,
        unitsData,
        hasChanges,
        handleUpdateUnitStatus,
        handleCreateUnit,
        handleConfirmChanges,
        handleResetChanges,
        resetFilters
    } = useUnitsPageController(initialUnits);

    const suggestedUnitId = useMemo(() => {
        const maxNumber = unitsData.reduce((max, unit) => {
            const numericFromId = Number.parseInt(unit.id.replace(/\D/g, ""), 10);
            const candidate = Number.isNaN(numericFromId) ? unit.number : numericFromId;
            return Math.max(max, candidate);
        }, 0);

        return `U-${String(maxNumber + 1).padStart(2, "0")}`;
    }, [unitsData]);

    const clearCreateQueryParam = () => {
        if (!shouldAutoOpenCreateDialog) {
            return;
        }

        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.delete("create");
        const nextUrl = nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname;
        router.replace(nextUrl);
    };

    const handleCreateUnitFromDialog = async (payload: CreateUnitPayload): Promise<string | null> => {
        const result = await createUnit(payload);

        if (!result.ok) {
            return result.error;
        }

        handleCreateUnit(result.unit);
        router.refresh();
        return null;
    };

    const handleCreateDialogOpenChange = (open: boolean) => {
        setIsManualCreateDialogOpen(open);

        if (!open) {
            clearCreateQueryParam();
        }
    };

    return (
        <Flex direction="column" gap="4">
            <Flex justify="between" align="end" mb="2">
                <Box>
                    <Heading size="8" mb="1">Dental Units</Heading>
                    <Text color="gray" size="2">Manage and monitor your clinic&#39;s equipment health and status.</Text>
                </Box>
                <Button size="3" onClick={() => setIsManualCreateDialogOpen(true)}>
                    <PlusIcon /> Add New Unit
                </Button>
            </Flex>

            <CreateUnitDialog
                open={isCreateDialogOpen}
                onOpenChange={handleCreateDialogOpenChange}
                onCreate={handleCreateUnitFromDialog}
                existingUnitIds={unitsData.map((unit) => unit.id)}
                suggestedUnitId={suggestedUnitId}
            />

            <UnitFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                areaFilter={areaFilter}
                setAreaFilter={setAreaFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                resetFilters={resetFilters}
                hasChanges={hasChanges}
                handleResetChanges={handleResetChanges}
                handleConfirmChanges={handleConfirmChanges}
            />

            {filteredUnits.length > 0 ? (
                <Grid columns={{ initial: "1", sm: "2", lg: "3" }} gap="4">
                    {filteredUnits.map((unit) => (
                        <UnitCard
                            key={unit.id}
                            unit={unit}
                            onUpdateStatus={(newStatus) => handleUpdateUnitStatus(unit.id, newStatus)}
                        />
                    ))}
                </Grid>
            ) : (
                <Flex direction="column" align="center" justify="center" py="9" gap="2">
                    <Text color="gray" size="4">No units found matching your criteria</Text>
                    <Button variant="soft" onClick={resetFilters}>Clear all filters</Button>
                </Flex>
            )}
        </Flex>
    );
}