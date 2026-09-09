'use client'

import {useMemo, useState} from "react";
import {Button, Card, Flex, Heading, Separator, Text} from "@radix-ui/themes";
import {MaintenanceItem, MaintenanceReportOption, MaintenanceUnitOption} from "@/lib/types";
import {MaintenanceKpiCards} from "./components/MaintenanceKpiCards";
import {MaintenanceFilters, MaintenanceFilterState} from "./components/MaintenanceFilters";
import {MaintenanceCalendar} from "./components/MaintenanceCalendar";
import {MaintenanceDetailsDialog} from "./components/MaintenanceDetailsDialog";
import {MaintenanceUpcomingList} from "./components/MaintenanceUpcomingList";
import {ScheduleMaintenanceDialog, ScheduleMaintenancePayload} from "./components/ScheduleMaintenanceDialog";
import {EditMaintenanceDialog, UpdateMaintenancePayload} from "./components/EditMaintenanceDialog";
import {CompleteMaintenanceDialog, CompleteMaintenancePayload} from "./components/CompleteMaintenanceDialog";
import {completeMaintenance, createMaintenance, updateMaintenance} from "./actions";
import {useRouter} from "next/navigation";

interface MaintenancePageClientProps {
    initialMaintenanceItems: MaintenanceItem[];
    availableUnits: MaintenanceUnitOption[];
    availableReports: MaintenanceReportOption[];
}

function parseDate(value: string | null): Date | null {
    if (!value) {
        return null;
    }

    return new Date(value);
}

function isSameLocalDay(first: Date, second: Date) {
    return first.getFullYear() === second.getFullYear()
        && first.getMonth() === second.getMonth()
        && first.getDate() === second.getDate();
}

function getDayBounds(reference: Date) {
    const start = new Date(reference);
    start.setHours(0, 0, 0, 0);

    const end = new Date(reference);
    end.setHours(23, 59, 59, 999);

    return {start, end};
}

function applyFilters(items: MaintenanceItem[], filters: MaintenanceFilterState) {
    return items.filter((item) => {
        if (filters.area !== "All" && item.area !== filters.area) {
            return false;
        }

        if (filters.unit !== "All" && item.unitCode !== filters.unit) {
            return false;
        }

        if (filters.type !== "All" && item.type !== filters.type) {
            return false;
        }

        if (filters.status !== "All" && item.status !== filters.status) {
            return false;
        }

        if (filters.priority !== "All" && item.priority !== filters.priority) {
            return false;
        }

        return true;
    });
}

export function MaintenancePageClient({
    initialMaintenanceItems,
    availableUnits,
    availableReports
}: MaintenancePageClientProps) {
    const router = useRouter();
    const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MaintenanceItem | null>(null);
    const [editingItem, setEditingItem] = useState<MaintenanceItem | null>(null);
    const [completingItem, setCompletingItem] = useState<MaintenanceItem | null>(null);
    const [filters, setFilters] = useState<MaintenanceFilterState>({
        area: "All",
        unit: "All",
        type: "All",
        status: "All",
        priority: "All"
    });

    const filteredItems = useMemo(
        () => applyFilters(initialMaintenanceItems, filters),
        [initialMaintenanceItems, filters]
    );

    const visibleScheduledItems = useMemo(
        () => filteredItems.filter((item) => item.scheduledFor),
        [filteredItems]
    );

    const activeUpcomingItems = useMemo(
        () => filteredItems.filter((item) => item.status === "Scheduled" || item.status === "In Progress"),
        [filteredItems]
    );

    const stats = useMemo(() => {
        const now = new Date();
        const {start: startOfToday, end: endOfToday} = getDayBounds(now);

        return filteredItems.reduce((acc, item) => {
            if (item.status === "Completed") {
                acc.completed += 1;
            }

            const scheduledStart = parseDate(item.scheduledFor);
            const scheduledEnd = parseDate(item.scheduledUntil);

            if (!scheduledStart) {
                return acc;
            }

            const isActive = item.status === "Scheduled" || item.status === "In Progress";

            if (!isActive) {
                return acc;
            }

            const overdueByEnd = scheduledEnd ? scheduledEnd < now : scheduledStart < startOfToday;

            if (overdueByEnd) {
                acc.overdue += 1;
            } else {
                acc.scheduled += 1;
            }

            if (isSameLocalDay(scheduledStart, now) && !overdueByEnd && scheduledStart <= endOfToday) {
                acc.dueToday += 1;
            }

            return acc;
        }, {
            scheduled: 0,
            dueToday: 0,
            overdue: 0,
            completed: 0
        });
    }, [filteredItems]);

    const hasData = initialMaintenanceItems.length > 0;
    const hasVisibleData = filteredItems.length > 0;

    const handleCreateMaintenance = async (payload: ScheduleMaintenancePayload) => {
        const result = await createMaintenance(payload);

        if (!result.ok) {
            return result;
        }

        router.refresh();

        return {
            ok: true as const
        };
    };

    const handleUpdateMaintenance = async (payload: UpdateMaintenancePayload) => {
        const result = await updateMaintenance(payload);

        if (!result.ok) {
            return result;
        }

        router.refresh();

        return {
            ok: true as const
        };
    };

    const handleEditRequest = (item: MaintenanceItem) => {
        setEditingItem(item);
        setSelectedItem(null);
        setIsEditDialogOpen(true);
    };

    const handleCompleteRequest = (item: MaintenanceItem) => {
        setCompletingItem(item);
        setIsCompleteDialogOpen(true);
    };

    const handleCompleteMaintenance = async (payload: CompleteMaintenancePayload) => {
        const result = await completeMaintenance(payload);

        if (!result.ok) {
            return result;
        }

        router.refresh();
        setSelectedItem(null);
        setCompletingItem(null);
        setIsCompleteDialogOpen(false);

        return {
            ok: true as const
        };
    };

    return (
        <Flex direction="column" gap="4">
            <Flex justify="between" align="end" gap="3" wrap="wrap">
                <Flex direction="column" gap="1">
                    <Heading size="8">Maintenance Planning &amp; Operations</Heading>
                    <Text size="4" color="gray">
                        Schedule, prioritize, and monitor maintenance across dental units.
                    </Text>
                </Flex>
                <Button color="blue" onClick={() => setIsScheduleDialogOpen(true)}>
                    + Schedule Maintenance
                </Button>
            </Flex>

            <ScheduleMaintenanceDialog
                open={isScheduleDialogOpen}
                onOpenChange={setIsScheduleDialogOpen}
                onCreate={handleCreateMaintenance}
                availableUnits={availableUnits}
                availableReports={availableReports}
            />

            <EditMaintenanceDialog
                item={editingItem}
                open={isEditDialogOpen}
                onOpenChange={(open) => {
                    setIsEditDialogOpen(open);

                    if (!open) {
                        setEditingItem(null);
                    }
                }}
                onUpdate={handleUpdateMaintenance}
                availableUnits={availableUnits}
                availableReports={availableReports}
            />

            <CompleteMaintenanceDialog
                item={completingItem}
                open={isCompleteDialogOpen}
                onOpenChange={(open) => {
                    setIsCompleteDialogOpen(open);

                    if (!open) {
                        setCompletingItem(null);
                    }
                }}
                onSubmit={handleCompleteMaintenance}
            />

            <MaintenanceKpiCards stats={stats}/>
            <Separator size="4"/>

            <MaintenanceFilters
                items={initialMaintenanceItems}
                filters={filters}
                onFiltersChange={setFilters}
            />

            <MaintenanceCalendar
                items={visibleScheduledItems}
                onSelectItem={setSelectedItem}
            />
            <MaintenanceUpcomingList items={activeUpcomingItems}/>

            {!hasData ? (
                <Card>
                    <Flex direction="column" gap="2" align="center" justify="center" py="6">
                        <Heading size="5">No maintenance scheduled</Heading>
                        <Text color="gray">Calendar is ready and will populate when maintenance records are created.</Text>
                    </Flex>
                </Card>
            ) : !hasVisibleData ? (
                <Card>
                    <Flex direction="column" gap="3" align="center" justify="center" py="6">
                        <Heading size="5">No maintenance matches these filters</Heading>
                        <Text color="gray">Try clearing one or more filters to see additional records.</Text>
                        <Button variant="soft" onClick={() => setFilters({
                            area: "All",
                            unit: "All",
                            type: "All",
                            status: "All",
                            priority: "All"
                        })}>
                            Clear filters
                        </Button>
                    </Flex>
                </Card>
            ) : null}

            <MaintenanceDetailsDialog
                item={selectedItem}
                open={Boolean(selectedItem)}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedItem(null);
                    }
                }}
                onEditRequest={handleEditRequest}
                onCompleteRequest={handleCompleteRequest}
            />
        </Flex>
    );
}
