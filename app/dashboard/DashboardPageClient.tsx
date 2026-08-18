'use client'

import {Button, Flex, Separator, Text} from "@radix-ui/themes";
import {useDashboardPageController} from "./hooks/useDashboardPageController";
import {StatsRow, UnitStats} from "@/app/dashboard/components/globals/StatsRow";
import {SearchToolbar} from "@/app/dashboard/components/globals/SearchToolbar";
import {RpTest} from "./components/RpTest";
import {Report} from "@/lib/types";

interface DashboardPageClientProps {
    unitStats: UnitStats;
    initialReports: Report[];
}

export function DashboardPageClient({unitStats, initialReports}: DashboardPageClientProps) {
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
        tableData,
        filteredData,
        handleToggleStatus,
        handleUpdateStatus,
        handleSelectAll,
        handleConfirmChanges,
        handleResetChanges,
        resetFilters
    } = useDashboardPageController({initialReports});
    const hasReports = tableData.length > 0;
    const hasActiveFilters = Boolean(searchQuery || statusFilter || priorityFilter || areaFilter);

    return (
        <>
            <StatsRow stats={unitStats}/>
            <Separator className="my-4" size="4" color="blue"/>
            <SearchToolbar
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

            {hasReports && (
                <RpTest
                    filteredData={filteredData}
                    handleSelectAll={handleSelectAll}
                    handleToggleStatus={handleToggleStatus}
                    handleUpdateStatus={handleUpdateStatus}
                />
            )}

            {!hasReports ? (
                <Flex direction="column" align="center" justify="center" py="9" gap="2">
                    <Text color="gray" size="4">No incidents have been reported</Text>
                </Flex>
            ) : filteredData.length === 0 && hasActiveFilters ? (
                <Flex direction="column" align="center" justify="center" py="9" gap="2">
                    <Text color="gray" size="4">No reports found matching your criteria</Text>
                    <Button variant="soft" onClick={resetFilters}>Clear all filters</Button>
                </Flex>
            ) : null}
        </>
    );
}