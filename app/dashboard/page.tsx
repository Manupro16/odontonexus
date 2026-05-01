'use client'

import {Button, Flex, Separator, Text} from "@radix-ui/themes";
import {useDashboardPageController} from "./hooks/useDashboardPageController";
import {StatsRow} from "./components/StatsRow";
import {ReportsToolbar} from "./components/ReportsToolbar";
import {ReportsTable} from "./components/ReportsTable";

export default function DashBoard() {
    const {
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        areaFilter,
        setAreaFilter,
        hasChanges,
        filteredData,
        handleToggleStatus,
        handleUpdateStatus,
        handleSelectAll,
        handleConfirmChanges,
        handleResetChanges,
        resetFilters
    } = useDashboardPageController();

    return (
        <>
            <StatsRow/>
            <Separator className="my-4" size="4" color="blue"/>
            <ReportsToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                areaFilter={areaFilter}
                setAreaFilter={setAreaFilter}
                resetFilters={resetFilters}
                hasChanges={hasChanges}
                handleResetChanges={handleResetChanges}
                handleConfirmChanges={handleConfirmChanges}
            />

            <ReportsTable
                filteredData={filteredData}
                handleSelectAll={handleSelectAll}
                handleToggleStatus={handleToggleStatus}
                handleUpdateStatus={handleUpdateStatus}
            />

            {filteredData.length === 0 && (
                <Flex direction="column" align="center" justify="center" py="9" gap="2">
                    <Text color="gray" size="4">No units found matching your criteria</Text>
                    <Button variant="soft" onClick={resetFilters}>Clear all filters</Button>
                </Flex>
            )}
        </>
    );
}
