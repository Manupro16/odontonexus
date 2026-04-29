import {
    Grid,
    Box,
    Flex,
    DropdownMenu,
    Button,
    DataList,
    Code,
    IconButton,
    Badge,
    Text,
    Separator
} from "@radix-ui/themes";
import {CopyIcon, DoubleArrowLeftIcon, DashboardIcon, CubeIcon, ExclamationTriangleIcon, InfoCircledIcon, GearIcon, GridIcon, ExitIcon} from "@radix-ui/react-icons"
import Link from "next/link";


const TextConfig = {
    size: "3" as const,
    weight: "bold" as const,
    color: "gray" as const,
    highContrast: true,
}

export default function Home() {
    return (
        <Grid
            as="div"
            columns="260px 1fr"
            rows="72px 1fr"
            className="min-h-screen"
        >
            <aside className="row-start-1 row-end-3 col-start-1 border-r border-white/10">
                <Flex className="h-18 border-b border-white/10 px-4" justify="between" align="center">
                    <Box className="">
                        <Text weight="bold" size="4">ODONTONEXUS</Text>
                    </Box>
                    <DoubleArrowLeftIcon/>
                </Flex>

                <Flex direction="column"  justify="start" align="start" className="px-5 py-5" gap="4">
                    <Flex align="center" gapX="3">
                        <DashboardIcon   />
                        <Text {...TextConfig} >Dashboard</Text>
                    </Flex>
                    <Flex align="center" gapX="3">
                        <CubeIcon   />
                        <Text {...TextConfig}>Unit</Text>
                    </Flex>
                    <Flex align="center" gapX="3">
                        <ExclamationTriangleIcon  />
                        <Text {...TextConfig}>Report</Text>
                    </Flex>
                    <Flex align="center" gapX="3">
                        <GearIcon   />
                        <Text {...TextConfig}>Maintenance</Text>
                    </Flex>
                       <Flex align="center" gapX="3">
                        <GridIcon   />
                        <Text {...TextConfig}>Areas</Text>
                    </Flex>
                </Flex>
                <Separator orientation="horizontal" size="4"   />
                 <Flex direction="column"  justify="start" align="start" className="px-5 py-5" gap="4">
                    <Flex align="center" gapX="3">
                        <GearIcon   />
                        <Text {...TextConfig} >Settings</Text>
                    </Flex>
                    <Flex align="center" gapX="3">
                        <ExitIcon   />
                        <Text {...TextConfig}>Logout</Text>
                    </Flex>
                </Flex>

            </aside>

            <header className="row-start-1 col-start-2 border-b border-white/10 px-6 ">
                TopBar
            </header>

            <main className="row-start-2 col-start-2 p-6">
                Dashboard
            </main>
        </Grid>
    );
}

