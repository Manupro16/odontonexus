'use client'

import {Button, Flex, Grid, Heading, Text, Box} from "@radix-ui/themes";
import {useUnitsPageController} from "../hooks/useUnitsPageController";
import {UnitCard} from "@/app/dashboard/components/units-components/UnitCard";
import {UnitFilters} from "@/app/dashboard/components/units-components/UnitFilters";
import {PlusIcon} from "@radix-ui/react-icons";

export default function UnitsPage() {
    const {
        searchQuery,
        setSearchQuery,
        areaFilter,
        setAreaFilter,
        statusFilter,
        setStatusFilter,
        filteredUnits,
        hasChanges,
        handleUpdateUnitStatus,
        handleConfirmChanges,
        handleResetChanges,
        resetFilters
    } = useUnitsPageController();

    return (
        <Flex direction="column" gap="4">
            <Flex justify="between" align="end" mb="2">
                <Box>
                    <Heading size="8" mb="1">Dental Units</Heading>
                    <Text color="gray" size="2">Manage and monitor your clinic&#39;s equipment health and status.</Text>
                </Box>
                <Button size="3">
                    <PlusIcon /> Add New Unit
                </Button>
            </Flex>

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
