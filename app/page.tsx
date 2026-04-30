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
    ActivityLogIcon,
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

const dashboardData = {
    totalUnits: 42,
    functionalUnits: 28,
    partiallyFunctionalUnits: 9,
    nonFunctionalUnits: 5,
    openReports: 7,
    unitsInMaintenance: 4,
    unitsByArea: [
        {name: "Adultos", total: 18},
        {name: "Endodoncia", total: 10},
        {name: "Cirugía", total: 6},
        {name: "Odontopediatría", total: 8},
    ],
    recentReports: [
        {unit: "Unit 12", issue: "Lamp failure", area: "Adultos"},
        {unit: "Unit 03", issue: "Pedal issue", area: "Endodoncia"},
        {unit: "Unit 08", issue: "Micromotor not working", area: "Cirugía"},
    ],
};

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
                        <Table.Row>
                            <Table.RowHeaderCell>
                                <Flex gap="2">
                                    <Checkbox defaultChecked/>
                                    Unit 12
                                </Flex>
                            </Table.RowHeaderCell>
                            <Table.Cell>Lamp failure</Table.Cell>
                            <Table.Cell>Adultos</Table.Cell>
                            <Table.Cell>Open</Table.Cell>
                            <Table.Cell> <Badge color="orange">Medium</Badge></Table.Cell>
                            <Table.Cell>
                                <Text>Current{" "}
                                    <HoverCard.Root>
                                        <HoverCard.Trigger>
                                            <Text color="blue">
                                                <Strong>Comments</Strong>
                                            </Text>
                                        </HoverCard.Trigger>
                                        <HoverCard.Content maxWidth="300px">
                                            <Flex gap="4">
                                                <Avatar
                                                    size="3"
                                                    fallback="R"
                                                    radius="full"
                                                    src="https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png"
                                                />
                                                <Box>
                                                    <Heading size="3" as="h3">
                                                        Radix
                                                    </Heading>
                                                    <Text as="div" size="2" color="gray" mb="2">
                                                        @radix_ui
                                                    </Text>
                                                    <Text as="div" size="2">
                                                        React components, icons, and colors for building high-quality,
                                                        accessible UI.
                                                    </Text>
                                                </Box>
                                            </Flex>
                                        </HoverCard.Content>
                                    </HoverCard.Root>
                                </Text>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>

            </main>
        </Grid>
    );
}

