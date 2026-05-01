'use client'


import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Checkbox,
    DropdownMenu,
    Flex,
    Grid,
    Heading,
    HoverCard,
    IconButton,
    ScrollArea,
    Separator,
    Strong,
    Table,
    Text,
    TextField
} from "@radix-ui/themes";
import {
    CheckCircledIcon,
    ChevronDownIcon,
    CubeIcon,
    DotsVerticalIcon,
    ExclamationTriangleIcon,
    Half2Icon,
    MagnifyingGlassIcon,
    ResetIcon
} from "@radix-ui/react-icons"
import {useMemo, useState} from "react";
import {SideBar} from "@/app/components/layouts/SideBar";
import TopBar from "@/app/components/layouts/TopBar";


const mockComments = [
    {
        id: 1,
        user: "Dr. Smith",
        text: "The lamp flickering is getting worse. Needs immediate attention.",
        time: "2h ago"
    },
    {
        id: 2,
        user: "Tech Support",
        text: "Ordered replacement bulb. Should arrive by tomorrow.",
        time: "1h ago"
    },
    {
        id: 3,
        user: "Dr. Smith",
        text: "Thanks, please update when installed.",
        time: "30m ago"
    },
    {
        id: 4,
        user: "Assistant",
        text: "Cleaned the unit area while waiting.",
        time: "10m ago"
    },
    {
        id: 5,
        user: "Tech Support",
        text: "Bulb arrived, scheduled for installation at 4 PM.",
        time: "Just now"
    },
];

const mockTableData = [
    {
        id: 1,
        unit: "Unit 12",
        issue: "Lamp failure",
        area: "Adultos",
        status: "Open",
        priority: "Medium",
        priorityColor: "orange" as const,
    },
    {
        id: 2,
        unit: "Unit 03",
        issue: "Pedal issue",
        area: "Endodoncia",
        status: "In Progress",
        priority: "High",
        priorityColor: "red" as const,
    },
    {
        id: 3,
        unit: "Unit 08",
        issue: "Micromotor not working",
        area: "Cirugía",
        status: "Open",
        priority: "Low",
        priorityColor: "green" as const,
    },
    {
        id: 4,
        unit: "Unit 15",
        issue: "Water leak",
        area: "Odontopediatría",
        status: "Closed",
        priority: "Medium",
        priorityColor: "orange" as const,
    },
    {
        id: 5,
        unit: "Unit 22",
        issue: "Suction power low",
        area: "Adultos",
        status: "Open",
        priority: "High",
        priorityColor: "red" as const,
    },
];

export default function Home() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
    const [areaFilter, setAreaFilter] = useState<string | null>(null)
    const [tableData, setTableData] = useState(mockTableData)
    const [originalData, setOriginalData] = useState(mockTableData)

    const hasChanges = useMemo(() => {
        return JSON.stringify(tableData) !== JSON.stringify(originalData);
    }, [tableData, originalData]);

    const handleToggleStatus = (id: number, checked: boolean) => {
        setTableData(prev => prev.map(item =>
            item.id === id
                ? { ...item, status: checked ? "Closed" : "Open" }
                : item
        ))
    }

    const handleUpdateStatus = (id: number, newStatus: string) => {
        setTableData(prev => prev.map(item =>
            item.id === id
                ? { ...item, status: newStatus }
                : item
        ))
    }

    const handleSelectAll = (checked: boolean) => {
        const filteredIds = filteredData.map(item => item.id);
        setTableData(prev => prev.map(item =>
            filteredIds.includes(item.id)
                ? { ...item, status: checked ? "Closed" : "Open" }
                : item
        ));
    }

    const handleConfirmChanges = () => {
        setOriginalData(tableData);
    }

    const handleResetChanges = () => {
        setTableData(originalData);
    }

    const filteredData = tableData.filter(item => {
        const matchesSearch = item.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.issue.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter ? item.status === statusFilter : true;
        const matchesPriority = priorityFilter ? item.priority === priorityFilter : true;
        const matchesArea = areaFilter ? item.area === areaFilter : true;
        return matchesSearch && matchesStatus && matchesPriority && matchesArea;
    });

    const resetFilters = () => {
        setSearchQuery("");
        setStatusFilter(null);
        setPriorityFilter(null);
        setAreaFilter(null);
    }


    return (
        <Grid
            as="div"
            columns={isSidebarOpen ? "260px 1fr" : "72px 1fr"}
            rows="72px 1fr"
            className="min-h-screen overflow-hidden"
        >
            <SideBar isOpen={isSidebarOpen} onToggleAction={() => setIsSidebarOpen((prev) => !prev)} />
            <TopBar  />
            <main className="row-start-2 col-start-2 p-6 overflow-y-auto">
                <Grid columns="4" gap="4">
                    <Card size="1" className="bg-white/5 border-border-strong">
                        <Flex direction="column" gap="1">
                            <Flex justify="between" align="center">
                                <Text size="1" color="gray" weight="medium" className="uppercase tracking-wider">Total
                                    Units</Text>
                                <CubeIcon className="text-blue-400"/>
                            </Flex>
                            <Heading size="5">42</Heading>
                        </Flex>
                    </Card>

                    <Card size="1" className="bg-white/5 border-border-strong">
                        <Flex direction="column" gap="1">
                            <Flex justify="between" align="center">
                                <Text size="1" color="gray" weight="medium"
                                      className="uppercase tracking-wider">Functional</Text>
                                <CheckCircledIcon className="text-green-400"/>
                            </Flex>
                            <Heading size="5">28</Heading>
                        </Flex>
                    </Card>

                    <Card size="1" className="bg-white/5 border-border-strong">
                        <Flex direction="column" gap="1">
                            <Flex justify="between" align="center">
                                <Text size="1" color="gray" weight="medium"
                                      className="uppercase tracking-wider">Partial</Text>
                                <Half2Icon className="text-yellow-400"/>
                            </Flex>
                            <Heading size="5">9</Heading>
                        </Flex>
                    </Card>

                    <Card size="1" className="bg-white/5 border-border-strong">
                        <Flex direction="column" gap="1">
                            <Flex justify="between" align="center">
                                <Text size="1" color="gray" weight="medium"
                                      className="uppercase tracking-wider">Non-Functional</Text>
                                <ExclamationTriangleIcon className="text-red-400"/>
                            </Flex>
                            <Heading size="5">5</Heading>
                        </Flex>
                    </Card>
                </Grid>
                <Separator className="my-4" size="4" color="blue"/>
                <Flex gap="4" align="center" mb="4">
                    <Box flexGrow="1">
                        <TextField.Root
                            placeholder="Search unit or issue..."
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
                                <DropdownMenu.Item onClick={() => setStatusFilter("Open")}>Open</DropdownMenu.Item>
                                <DropdownMenu.Item onClick={() => setStatusFilter("In Progress")}>In
                                    Progress</DropdownMenu.Item>
                                <DropdownMenu.Item onClick={() => setStatusFilter("Closed")}>Closed</DropdownMenu.Item>
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
                                <DropdownMenu.Item onClick={() => setPriorityFilter("High")}>High</DropdownMenu.Item>
                                <DropdownMenu.Item
                                    onClick={() => setPriorityFilter("Medium")}>Medium</DropdownMenu.Item>
                                <DropdownMenu.Item onClick={() => setPriorityFilter("Low")}>Low</DropdownMenu.Item>
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
                                <DropdownMenu.Item onClick={() => setAreaFilter("Adultos")}>Adultos</DropdownMenu.Item>
                                <DropdownMenu.Item
                                    onClick={() => setAreaFilter("Endodoncia")}>Endodoncia</DropdownMenu.Item>
                                <DropdownMenu.Item onClick={() => setAreaFilter("Cirugía")}>Cirugía</DropdownMenu.Item>
                                <DropdownMenu.Item
                                    onClick={() => setAreaFilter("Odontopediatría")}>Odontopediatría</DropdownMenu.Item>
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
                        <Flex gap="3" align="center" className="ml-auto bg-blue-500/10 py-1 px-3 rounded-full border border-blue-500/20">
                            <Text size="2" color="blue" weight="medium">
                                Unsaved status changes
                            </Text>
                            <Button variant="ghost" size="1" color="gray" onClick={handleResetChanges}>
                                <ResetIcon /> Reset
                            </Button>
                            <Button variant="soft" size="1" color="blue" onClick={handleConfirmChanges}>
                                <CheckCircledIcon /> Confirm
                            </Button>
                        </Flex>
                    )}
                </Flex>

                <Table.Root variant="surface">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>
                                <Flex gap="2" align="center">
                                    <Checkbox
                                        checked={
                                            filteredData.length > 0 && filteredData.every(item => item.status === "Closed")
                                                ? true
                                                : filteredData.some(item => item.status === "Closed")
                                                    ? "indeterminate"
                                                    : false
                                        }
                                        onCheckedChange={(checked) => handleSelectAll(checked === true)}
                                    />
                                    Unit #
                                </Flex>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Component / Issue</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Area</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Priority</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Comments</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Extra</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {filteredData.map((row) => (
                            <Table.Row key={row.id}>
                                <Table.RowHeaderCell>
                                    <Flex gap="2" align="center">
                                         <Checkbox
                                             checked={row.status === "Closed"}
                                             onCheckedChange={(checked) => handleToggleStatus(row.id, checked === true)}
                                         />
                                        {row.unit}
                                    </Flex>
                                </Table.RowHeaderCell>
                                <Table.Cell>{row.issue}</Table.Cell>
                                <Table.Cell>{row.area}</Table.Cell>
                                <Table.Cell>
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger>
                                            <Box className="cursor-pointer hover:opacity-80 transition-opacity">
                                                <Badge variant="soft" color={
                                                    row.status === "Open" ? "red" :
                                                        row.status === "In Progress" ? "blue" : "green"
                                                } className="gap-1">
                                                    {row.status}
                                                    <ChevronDownIcon width="12" height="12"/>
                                                </Badge>
                                            </Box>
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Content>
                                            <DropdownMenu.Item onClick={() => handleUpdateStatus(row.id, "Open")}>
                                                <Flex gap="2" align="center">
                                                    <Badge color="red" variant="soft" size="1">Open</Badge>
                                                </Flex>
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item onClick={() => handleUpdateStatus(row.id, "In Progress")}>
                                                <Flex gap="2" align="center">
                                                    <Badge color="blue" variant="soft" size="1">In Progress</Badge>
                                                </Flex>
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item onClick={() => handleUpdateStatus(row.id, "Closed")}>
                                                <Flex gap="2" align="center">
                                                    <Badge color="green" variant="soft" size="1">Closed</Badge>
                                                </Flex>
                                            </DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                </Table.Cell>
                                <Table.Cell>
                                    <Badge color={row.priorityColor}>{row.priority}</Badge>
                                </Table.Cell>
                                <Table.Cell>
                                    <HoverCard.Root>
                                        <HoverCard.Trigger>
                                            <Text color="blue" className="cursor-pointer hover:underline">
                                                <Strong>Comments</Strong>
                                            </Text>
                                        </HoverCard.Trigger>
                                        <HoverCard.Content maxWidth="400px">
                                            <ScrollArea type="always" scrollbars="vertical" style={{height: 200}}>
                                                <Box pr="4">
                                                    <Heading size="3" mb="3">Unit Comments</Heading>
                                                    <Flex direction="column" gap="4">
                                                        {mockComments.map((comment) => (
                                                            <Flex key={comment.id} gap="3" align="start">
                                                                <Avatar
                                                                    size="2"
                                                                    fallback={comment.user[0]}
                                                                    radius="full"
                                                                    variant="soft"
                                                                    color="blue"
                                                                />
                                                                <Box flexGrow="1">
                                                                    <Flex justify="between" align="center" gap="4"
                                                                          mb="1">
                                                                        <Text size="2"
                                                                              weight="bold">{comment.user}</Text>
                                                                        <Text size="1"
                                                                              color="gray">{comment.time}</Text>
                                                                    </Flex>
                                                                    <Text as="p" size="2" color="gray" highContrast>
                                                                        {comment.text}
                                                                    </Text>
                                                                </Box>
                                                            </Flex>
                                                        ))}
                                                    </Flex>
                                                </Box>
                                            </ScrollArea>
                                        </HoverCard.Content>
                                    </HoverCard.Root>
                                </Table.Cell>
                                <Table.Cell>
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger>
                                            <IconButton variant="ghost" color="gray">
                                                <DotsVerticalIcon/>
                                            </IconButton>
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Content>
                                            <DropdownMenu.Item>View Details</DropdownMenu.Item>
                                            <DropdownMenu.Item>Edit Unit</DropdownMenu.Item>
                                            <DropdownMenu.Separator/>
                                            <DropdownMenu.Item>Assign Maintenance</DropdownMenu.Item>
                                            <DropdownMenu.Item color="red">Mark Out of Service</DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>

                {filteredData.length === 0 && (
                    <Flex direction="column" align="center" justify="center" py="9" gap="2">
                        <Text color="gray" size="4">No units found matching your criteria</Text>
                        <Button variant="soft" onClick={resetFilters}>Clear all filters</Button>
                    </Flex>
                )}

            </main>
        </Grid>
    );
}

