'use client'


import {Box, Button, Flex, Grid, Heading, IconButton, Separator, Text} from "@radix-ui/themes";
import {
    CubeIcon,
    DashboardIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
    ExclamationTriangleIcon,
    ExitIcon,
    GearIcon,
    GridIcon
} from "@radix-ui/react-icons"
import Link from "next/link";
import {useState} from "react";


const TextConfig = {
    size: "3" as const,
    weight: "bold" as const,
    color: "gray" as const,
    highContrast: true,
}

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
                className={`row-start-1 row-end-3 col-start-1 border-r border-white/10 transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-[260px]" : "w-[72px]"}`}>
                <Flex className="h-[72px] border-b border-white/10 px-4" justify={isSidebarOpen ? "between" : "center"}
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
                <Separator orientation="horizontal" size="4"/>
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
            <header className="row-start-1 col-start-2 border-b border-white/10 px-6">
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

            <main className="row-start-2 col-start-2 p-6">
                Dashboard
            </main>
        </Grid>
    );
}

