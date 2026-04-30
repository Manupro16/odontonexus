'use client'


import {
    Box,
    Button,
    Card,
    Flex,
    Grid,
    Heading,
    IconButton,
    Separator,
    Table,
    Text,
    Checkbox,
    Badge,
    HoverCard,
    Avatar, ScrollArea, Strong
} from "@radix-ui/themes";
import {
    CheckCircledIcon,
    CubeIcon,
    DashboardIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
    ExclamationTriangleIcon,
    ExitIcon,
    GearIcon,
    GridIcon,
    Half2Icon
} from "@radix-ui/react-icons"
import Link from "next/link";
import {useState} from "react";


const TextConfig = {
    size: "3" as const,
    weight: "bold" as const,
    color: "gray" as const,
    highContrast: true,
}

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

    return (
        <Grid
            as="div"
            columns={isSidebarOpen ? "260px 1fr" : "72px 1fr"}
            rows="72px 1fr"
            className="min-h-screen overflow-hidden"
        >
            <aside
                className={`row-start-1 row-end-3 col-start-1 border-r border-border-strong transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-[260px]" : "w-[72px]"}`}>
                <Flex className="h-[72px] border-b border-border-strong px-4"
                      justify={isSidebarOpen ? "between" : "center"}
                      align="center">
                    {isSidebarOpen && (
                        <Box className="">
                            <Text weight="bold" size="4">ODONTONEXUS</Text>
                        </Box>
                    )}
                    <IconButton
                        variant="ghost"
                        color="gray"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <DoubleArrowLeftIcon/> : <DoubleArrowRightIcon/>}
                    </IconButton>
                </Flex>

                <Flex direction="column" justify="start" align={isSidebarOpen ? "start" : "center"}
                      className="px-5 py-5" gap="4">
                    <Link href="/" className="w-full">
                        <Flex align="center" gapX="3"
                              className={`${isSidebarOpen ? "bg-white/5 py-2 px-3 rounded-lg" : "justify-center py-2"}`}>
                            <DashboardIcon className="text-white"/>
                            {isSidebarOpen && <Text {...TextConfig}>Dashboard</Text>}
                        </Flex>
                    </Link>
                    <Link href="/unit" className="w-full">
                        <Flex align="center" gapX="3" className={`${isSidebarOpen ? "px-3" : "justify-center"}`}>
                            <CubeIcon/>
                            {isSidebarOpen && <Text {...TextConfig}>Units</Text>}
                        </Flex>
                    </Link>
                    <Link href="/report" className="w-full">
                        <Flex align="center" gapX="3" className={`${isSidebarOpen ? "px-3" : "justify-center"}`}>
                            <ExclamationTriangleIcon/>
                            {isSidebarOpen && <Text {...TextConfig}>Reports</Text>}
                        </Flex>
                    </Link>
                    <Link href="/maintenance" className="w-full">
                        <Flex align="center" gapX="3" className={`${isSidebarOpen ? "px-3" : "justify-center"}`}>
                            <GearIcon/>
                            {isSidebarOpen && <Text {...TextConfig}>Maintenance</Text>}
                        </Flex>
                    </Link>
                    <Link href="/areas" className="w-full">
                        <Flex align="center" gapX="3" className={`${isSidebarOpen ? "px-3" : "justify-center"}`}>
                            <GridIcon/>
                            {isSidebarOpen && <Text {...TextConfig}>Areas</Text>}
                        </Flex>
                    </Link>
                </Flex>
                <Separator orientation="horizontal" size="4" className="bg-border-strong opacity-100"/>
                <Flex direction="column" justify="start" align={isSidebarOpen ? "start" : "center"}
                      className="px-5 py-5" gap="4">
                    <Link href="/settings" className="w-full">
                        <Flex align="center" gapX="3" className={`${isSidebarOpen ? "px-3" : "justify-center"}`}>
                            <GearIcon/>
                            {isSidebarOpen && <Text {...TextConfig} >Settings</Text>}
                        </Flex>
                    </Link>
                    <Link href="/logout" className="w-full">
                        <Flex align="center" gapX="3" className={`${isSidebarOpen ? "px-3" : "justify-center"}`}>
                            <ExitIcon/>
                            {isSidebarOpen && <Text {...TextConfig}>Logout</Text>}
                        </Flex>
                    </Link>
                </Flex>

            </aside>
            <header className="row-start-1 col-start-2 border-b border-border-strong px-6">
                <Flex justify="between" align="center" className="h-full">
                    <Flex direction="column" justify="center" align="start">
                        <Heading>Dashboard</Heading>
                        <Text color="gray">
                            Overview of dental unit status and operational activity
                        </Text>
                    </Flex>
                    <Flex align="center" gap="3">
                        <Button color="blue">Report Failure</Button>
                    </Flex>
                </Flex>
            </header>

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
                <Table.Root variant="surface">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>
                                <Flex gap="2">
                                    <Checkbox defaultChecked/>
                                    Unit #
                                </Flex>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Component / Issue</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Area</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Priority</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Comments</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {mockTableData.map((row) => (
                            <Table.Row key={row.id}>
                                <Table.RowHeaderCell>
                                    <Flex gap="2">
                                        <Checkbox defaultChecked={row.status === "Closed"}/>
                                        {row.unit}
                                    </Flex>
                                </Table.RowHeaderCell>
                                <Table.Cell>{row.issue}</Table.Cell>
                                <Table.Cell>{row.area}</Table.Cell>
                                <Table.Cell>{row.status}</Table.Cell>
                                <Table.Cell>
                                    <Badge color={row.priorityColor}>{row.priority}</Badge>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text>Current{" "}
                                        <HoverCard.Root>
                                            <HoverCard.Trigger>
                                                <Text color="blue">
                                                    <Strong>Comments</Strong>
                                                </Text>
                                            </HoverCard.Trigger>
                                            <HoverCard.Content maxWidth="400px">
                                                <ScrollArea type="always" scrollbars="vertical" style={{ height: 200 }}>
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
                                                                        <Flex justify="between" align="center" gap="4" mb="1">
                                                                            <Text size="2" weight="bold">{comment.user}</Text>
                                                                            <Text size="1" color="gray">{comment.time}</Text>
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
                                    </Text>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>

            </main>
        </Grid>
    );
}

