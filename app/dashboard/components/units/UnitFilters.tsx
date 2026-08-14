import {Box, Button, DropdownMenu, Flex, Text, TextField} from "@radix-ui/themes";
import {CheckCircledIcon, ChevronDownIcon, MagnifyingGlassIcon, ResetIcon} from "@radix-ui/react-icons";
import {UnitStatus} from "@/lib/types";
import {AREAS, UNIT_STATUSES} from "@/lib/constants";

interface UnitFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    areaFilter: string | null;
    setAreaFilter: (area: string | null) => void;
    statusFilter: UnitStatus | null;
    setStatusFilter: (status: UnitStatus | null) => void;
    resetFilters: () => void;
    hasChanges: boolean;
    handleResetChanges: () => void;
    handleConfirmChanges: () => void | Promise<void>;
    isSavingChanges?: boolean;
}

export function UnitFilters({
                                searchQuery,
                                setSearchQuery,
                                areaFilter,
                                setAreaFilter,
                                statusFilter,
                                setStatusFilter,
                                resetFilters,
                                hasChanges,
                                handleResetChanges,
                                handleConfirmChanges,
                                isSavingChanges = false
                            }: UnitFiltersProps) {
    return (
        <Flex gap="4" align="center" mb="6">
            <Box flexGrow="1">
                <TextField.Root
                    placeholder="Search by ID or Area..."
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

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button variant="soft" color="gray">
                            Status: {statusFilter || "All"}
                            <ChevronDownIcon/>
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item onClick={() => setStatusFilter(null)}>All Statuses</DropdownMenu.Item>
                        <DropdownMenu.Separator/>
                        {UNIT_STATUSES.map(status => (
                            <DropdownMenu.Item key={status} onClick={() => setStatusFilter(status)}>
                                {status}
                            </DropdownMenu.Item>
                        ))}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>

                {(searchQuery || areaFilter || statusFilter) && (
                    <Button variant="ghost" color="red" onClick={resetFilters}>
                        <ResetIcon/> Clear
                    </Button>
                )}
            </Flex>

            {hasChanges && (
                <Flex gap="3" align="center"
                      className="ml-auto bg-blue-500/10 py-1 px-3 rounded-full border border-blue-500/20">
                    <Text size="2" color="blue" weight="medium">
                        {isSavingChanges ? "Saving changes..." : "Unsaved status changes"}
                    </Text>
                    <Button variant="ghost" size="1" color="gray" onClick={handleResetChanges} disabled={isSavingChanges}>
                        <ResetIcon/> Reset
                    </Button>
                    <Button variant="soft" size="1" color="blue" onClick={handleConfirmChanges} disabled={isSavingChanges}>
                        <CheckCircledIcon/> Confirm
                    </Button>
                </Flex>
            )}
        </Flex>
    );
}
