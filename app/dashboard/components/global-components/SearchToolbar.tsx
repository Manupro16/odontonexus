import {Box, Button, DropdownMenu, Flex, Text, TextField} from "@radix-ui/themes";
import {CheckCircledIcon, ChevronDownIcon, MagnifyingGlassIcon, ResetIcon} from "@radix-ui/react-icons";
import {ReportPriority, ReportStatus} from "@/lib/types";
import {AREAS, REPORT_PRIORITIES, REPORT_STATUSES} from "@/lib/constants";

interface ReportsToolbarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: ReportStatus | null;
    setStatusFilter: (status: ReportStatus | null) => void;
    priorityFilter: ReportPriority | null;
    setPriorityFilter: (priority: ReportPriority | null) => void;
    areaFilter: string | null;
    setAreaFilter: (area: string | null) => void;
    resetFilters: () => void;
    hasChanges: boolean;
    handleResetChanges: () => void;
    handleConfirmChanges: () => void;
}

export function SearchToolbar({
                                   searchQuery,
                                   setSearchQuery,
                                   statusFilter,
                                   setStatusFilter,
                                   priorityFilter,
                                   setPriorityFilter,
                                   areaFilter,
                                   setAreaFilter,
                                   resetFilters,
                                   hasChanges,
                                   handleResetChanges,
                                   handleConfirmChanges
                               }: ReportsToolbarProps) {
    return (
        <Flex gap="4" align="center" mb="4">
            <Box flexGrow="1">
                <TextField.Root
                    placeholder="Search unit, issue or reporter..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                >
                    <TextField.Slot>
                        <MagnifyingGlassIcon height="16" width="16"/>
                    </TextField.Slot>
                </TextField.Root>
            </Box>
            <Flex gap="3">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button variant="soft" color="gray">
                            Status: {statusFilter || "All"}
                            <ChevronDownIcon/>
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item onClick={() => setStatusFilter(null)}>All
                            Statuses</DropdownMenu.Item>
                        <DropdownMenu.Separator/>
                        {REPORT_STATUSES.map(status => (
                            <DropdownMenu.Item key={status} onClick={() => setStatusFilter(status)}>
                                {status}
                            </DropdownMenu.Item>
                        ))}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button variant="soft" color="gray">
                            Priority: {priorityFilter || "All"}
                            <ChevronDownIcon/>
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item onClick={() => setPriorityFilter(null)}>All
                            Priorities</DropdownMenu.Item>
                        <DropdownMenu.Separator/>
                        {REPORT_PRIORITIES.map(priority => (
                            <DropdownMenu.Item key={priority} onClick={() => setPriorityFilter(priority)}>
                                {priority}
                            </DropdownMenu.Item>
                        ))}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button variant="soft" color="gray">
                            Area: {areaFilter || "All"}
                            <ChevronDownIcon/>
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item onClick={() => setAreaFilter(null)}>All Areas</DropdownMenu.Item>
                        <DropdownMenu.Separator/>
                        {AREAS.map(area => (
                            <DropdownMenu.Item key={area} onClick={() => setAreaFilter(area)}>
                                {area}
                            </DropdownMenu.Item>
                        ))}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>

                {(searchQuery || statusFilter || priorityFilter || areaFilter) && (
                    <Flex align="center">
                        <Button variant="ghost" color="red" onClick={resetFilters}>
                            <ResetIcon/> Clear Filters
                        </Button>
                    </Flex>
                )}
            </Flex>

            {hasChanges && (
                <Flex gap="3" align="center"
                      className="ml-auto bg-blue-500/10 py-1 px-3 rounded-full border border-blue-500/20">
                    <Text size="2" color="blue" weight="medium">
                        Unsaved status changes
                    </Text>
                    <Button variant="ghost" size="1" color="gray" onClick={handleResetChanges}>
                        <ResetIcon/> Reset
                    </Button>
                    <Button variant="soft" size="1" color="blue" onClick={handleConfirmChanges}>
                        <CheckCircledIcon/> Confirm
                    </Button>
                </Flex>
            )}
        </Flex>
    );
}
