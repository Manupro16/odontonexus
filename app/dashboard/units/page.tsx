'use client'

import {Button, Flex, Grid, Text} from "@radix-ui/themes";
import {useUnitsPageController} from "../hooks/useUnitsPageController";
import {UnitCard} from "../components/UnitCard";
import {UnitFilters} from "../components/UnitFilters";

export default function UnitsPage() {
    const {
        searchQuery,
        setSearchQuery,
        areaFilter,
        setAreaFilter,
        statusFilter,
        setStatusFilter,
        filteredUnits,
        resetFilters
    } = useUnitsPageController();

    return (
        <Flex direction="column" gap="4">
            <UnitFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                areaFilter={areaFilter}
                setAreaFilter={setAreaFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                resetFilters={resetFilters}
            />

            {filteredUnits.length > 0 ? (
                <Grid columns={{ initial: "1", sm: "2", lg: "3" }} gap="4">
                    {filteredUnits.map((unit) => (
                        <UnitCard key={unit.id} unit={unit} />
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
