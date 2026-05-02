import {Box, Button, DropdownMenu, Flex, TextField} from "@radix-ui/themes";
import {ChevronDownIcon, MagnifyingGlassIcon, ResetIcon} from "@radix-ui/react-icons";
import {UnitStatus} from "@/lib/types";

interface UnitFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    areaFilter: string | null;
    setAreaFilter: (area: string | null) => void;
    statusFilter: UnitStatus | null;
    setStatusFilter: (status: UnitStatus | null) => void;
    resetFilters: () => void;
}

export function UnitFilters({
                                searchQuery,
                                setSearchQuery,
                                areaFilter,
                                setAreaFilter,
                                statusFilter,
                                setStatusFilter,
                                resetFilters
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
                        <DropdownMenu.Item onClick={() => setAreaFilter("Adultos")}>Adultos</DropdownMenu.Item>
                        <DropdownMenu.Item onClick={() => setAreaFilter("Endodoncia")}>Endodoncia</DropdownMenu.Item>
                        <DropdownMenu.Item onClick={() => setAreaFilter("Cirugía")}>Cirugía</DropdownMenu.Item>
                        <DropdownMenu.Item onClick={() => setAreaFilter("Odontopediatría")}>Odontopediatría</DropdownMenu.Item>
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
                        <DropdownMenu.Item onClick={() => setStatusFilter("Operativa")}>Operativa</DropdownMenu.Item>
                        <DropdownMenu.Item onClick={() => setStatusFilter("Parcialmente Operativa")}>Parcialmente Operativa</DropdownMenu.Item>
                        <DropdownMenu.Item onClick={() => setStatusFilter("Fuera de Servicio")}>Fuera de Servicio</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>

                {(searchQuery || areaFilter || statusFilter) && (
                    <Button variant="ghost" color="red" onClick={resetFilters}>
                        <ResetIcon/> Clear
                    </Button>
                )}
            </Flex>
        </Flex>
    );
}
