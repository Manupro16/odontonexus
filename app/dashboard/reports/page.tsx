'use client'

import {Button, Flex, Heading, Text, Box, Separator} from "@radix-ui/themes";
import {useReportsPageController} from "../hooks/useReportsPageController";
import {ReportsSummaryStats} from "../components/ReportsSummaryStats";
import {SearchToolbar} from "@/app/dashboard/components/globals/SearchToolbar";
import {DownloadIcon, PlusIcon} from "@radix-ui/react-icons";
import {ReportsTable} from "@/app/dashboard/components/reports/ReportsTable";
import {CreateReportDialog, CreateReportPayload} from "@/app/dashboard/components/reports/CreateReportDialog";
import {Suspense, useMemo, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Report} from "@/lib/types";
import {mockUnits} from "@/lib/mock/units";

const priorityToColor = {
    High: "red",
    Medium: "orange",
    Low: "green"
} as const;

function ReportsPageContent() {
    const [isManualCreateDialogOpen, setIsManualCreateDialogOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const shouldAutoOpenCreateDialog = searchParams.get("create") === "true";
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
        tableData,
        filteredData,
        stats,
        handleToggleStatus,
        handleUpdateStatus,
        handleSelectAll,
        handleCreateReport,
        handleConfirmChanges,
        handleResetChanges,
        resetFilters
    } = useReportsPageController();

    const availableUnitIds = useMemo(() => mockUnits.map((unit) => unit.id), []);

    const clearCreateQueryParam = () => {
        if (!shouldAutoOpenCreateDialog) {
            return;
        }

        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.delete("create");
        const nextUrl = nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname;
        router.replace(nextUrl);
    };

    const handleCreateReportFromDialog = (payload: CreateReportPayload) => {
        const nextId = tableData.reduce((max, report) => Math.max(max, report.id), 0) + 1;

        const newReport: Report = {
            id: nextId,
            unit: payload.unit,
            issue: payload.issue,
            area: payload.area,
            status: "Open",
            priority: payload.priority,
            priorityColor: priorityToColor[payload.priority],
            createdAt: new Date().toISOString().slice(0, 10),
            reporter: payload.reporter
        };

        handleCreateReport(newReport);
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
                availableUnits={availableUnitIds}
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

export default function ReportsPage() {
    return (
        <Suspense fallback={null}>
            <ReportsPageContent />
        </Suspense>
    );
}
