'use client'

import {Button, Flex, Heading, Text, Box, Separator} from "@radix-ui/themes";
import {useReportsPageController} from "../hooks/useReportsPageController";
import {ReportsSummaryStats} from "../components/ReportsSummaryStats";
import {SearchToolbar} from "@/app/dashboard/components/globals/SearchToolbar";
import {DownloadIcon, PlusIcon} from "@radix-ui/react-icons";
import {ReportsTable} from "@/app/dashboard/components/reports/ReportsTable";
import {CreateReportDialog, CreateReportPayload} from "@/app/dashboard/components/reports/CreateReportDialog";
import {useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Report, ReportUnitOption} from "@/lib/types";
import {createReport} from "./actions";

interface ReportsPageClientProps {
    availableUnits: ReportUnitOption[];
    initialReports: Report[];
}

export function ReportsPageClient({availableUnits, initialReports}: ReportsPageClientProps) {
    const [isManualCreateDialogOpen, setIsManualCreateDialogOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const shouldAutoOpenCreateDialog = searchParams.get("create") === "true";
    const requestedUnitId = searchParams.get("unit");
    const preselectedUnitId = requestedUnitId && availableUnits.some((unit) => unit.unitCode === requestedUnitId)
        ? requestedUnitId
        : undefined;
    const isCreateDialogOpen = isManualCreateDialogOpen || shouldAutoOpenCreateDialog;

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
        handleCreateReport,
        handleConfirmChanges,
        handleResetChanges,
        resetFilters
    } = useReportsPageController({initialReports});

    const clearCreateQueryParam = () => {
        if (!shouldAutoOpenCreateDialog) {
            return;
        }

        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.delete("create");
        nextParams.delete("unit");
        const nextUrl = nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname;
        router.replace(nextUrl);
    };

    const handleCreateReportFromDialog = async (payload: CreateReportPayload) => {
        const result = await createReport(payload);

        if (!result.ok) {
            return result;
        }

        handleCreateReport(result.report);

        return {ok: true as const};
    };

    const handleCreateDialogOpenChange = (open: boolean) => {
        setIsManualCreateDialogOpen(open);

        if (!open) {
            clearCreateQueryParam();
        }
    };

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
                    <Button color="blue" onClick={() => setIsManualCreateDialogOpen(true)}>
                        <PlusIcon /> Create Report
                    </Button>
                </Flex>
            </Flex>

            <CreateReportDialog
                open={isCreateDialogOpen}
                onOpenChange={handleCreateDialogOpenChange}
                onCreate={handleCreateReportFromDialog}
                availableUnits={availableUnits}
                preselectedUnitId={preselectedUnitId}
            />

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