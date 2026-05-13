'use client'

import {Button, Flex, Heading, Text, Box, Separator} from "@radix-ui/themes";
import {useReportsPageController} from "../hooks/useReportsPageController";
import {ReportsSummaryStats} from "../components/ReportsSummaryStats";
import {SearchToolbar} from "../components/global-components/SearchToolbar";
import {RpTest} from "../components/RpTest";
import {DownloadIcon, PlusIcon} from "@radix-ui/react-icons";
import {ReportsTable} from "@/app/dashboard/components/reports-components/ReportsTable";

export default function ReportsPage() {
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
        stats,
        handleToggleStatus,
        handleUpdateStatus,
        handleSelectAll,
        handleConfirmChanges,
        handleResetChanges,
        resetFilters
    } = useReportsPageController();

    return (
        <Flex direction="column" gap="5">
            <Flex justify="between" align="end">
                <Box>
                    <Heading size="8" mb="1">Reports & Analytics</Heading>
                    <Text size="2" color="gray">Monitor equipment performance, incident logs, and resolution metrics.</Text>
                </Box>
                <Flex gap="3">
                    <Button variant="outline" color="gray">
                        <DownloadIcon /> Export
                    </Button>
                    <Button color="blue">
                        <PlusIcon /> Create Report
                    </Button>
                </Flex>
            </Flex>

            <ReportsSummaryStats stats={stats} />

            <Separator size="4" />

            <Box>
                <Heading size="4" mb="4">Incident Log</Heading>
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


                <ReportsTable filteredData={filteredData} handleSelectAll={handleSelectAll} handleToggleStatus={handleToggleStatus} handleUpdateStatus={handleUpdateStatus} />

                {filteredData.length === 0 && (
                    <Flex direction="column" align="center" justify="center" py="9" gap="2">
                        <Text color="gray" size="4">No reports found matching your criteria</Text>
                        <Button variant="soft" onClick={resetFilters}>Clear all filters</Button>
                    </Flex>
                )}
            </Box>
        </Flex>
    );
}
