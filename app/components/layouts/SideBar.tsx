import {Box, Flex, IconButton, Separator, Text} from "@radix-ui/themes";

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
import {usePathname} from "next/navigation";

const TextConfig = {
    size: "3" as const,
    weight: "bold" as const,
    color: "gray" as const,
    highContrast: true,
}

type SideBarProps = {
    isOpen: boolean,
    onToggleAction: () => void;
}


export function SideBar({ isOpen, onToggleAction }: SideBarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(href);
    }

    const getLinkClasses = (href: string) => {
        const active = isActive(href);
        const baseClasses = isOpen ? "py-2 px-3 rounded-lg transition-colors" : "justify-center py-2 transition-colors";
        const stateClasses = active ? "bg-white/10 text-white" : "hover:bg-white/5 text-gray-400";
        return `${baseClasses} ${stateClasses}`;
    }

    return (
        <aside
            className={`row-start-1 row-end-3 col-start-1 border-r border-border-strong transition-all duration-300 ease-in-out ${isOpen ? "w-[260px]" : "w-[72px]"}`}>
            <Flex className="h-[72px] border-b border-border-strong px-4"
                  justify={isOpen ? "between" : "center"}
                  align="center">
                {isOpen && (
                    <Box className="">
                        <Text weight="bold" size="4">ODONTONEXUS</Text>
                    </Box>
                )}
                <IconButton
                    variant="ghost"
                    color="gray"
                    onClick={onToggleAction}
                >
                    {isOpen ? <DoubleArrowLeftIcon/> : <DoubleArrowRightIcon/>}
                </IconButton>
            </Flex>

            <Flex direction="column" justify="start" align={isOpen ? "start" : "center"}
                  className="px-5 py-5" gap="4">
                <Link href="/dashboard" className="w-full">
                    <Flex align="center" gapX="3" className={getLinkClasses("/dashboard")}>
                        <DashboardIcon className={isActive("/dashboard") ? "text-white" : ""}/>
                        {isOpen && <Text {...TextConfig} color={undefined}>Dashboard</Text>}
                    </Flex>
                </Link>
                <Link href="/dashboard/units" className="w-full">
                    <Flex align="center" gapX="3" className={getLinkClasses("/dashboard/units")}>
                        <CubeIcon className={isActive("/dashboard/units") ? "text-white" : ""}/>
                        {isOpen && <Text {...TextConfig} color={undefined}>Units</Text>}
                    </Flex>
                </Link>
                <Link href="/dashboard/reports" className="w-full">
                    <Flex align="center" gapX="3" className={getLinkClasses("/dashboard/reports")}>
                        <ExclamationTriangleIcon className={isActive("/dashboard/reports") ? "text-white" : ""}/>
                        {isOpen && <Text {...TextConfig} color={undefined}>Reports</Text>}
                    </Flex>
                </Link>
                <Link href="/dashboard/maintenance" className="w-full">
                    <Flex align="center" gapX="3" className={getLinkClasses("/dashboard/maintenance")}>
                        <GearIcon className={isActive("/dashboard/maintenance") ? "text-white" : ""}/>
                        {isOpen && <Text {...TextConfig} color={undefined}>Maintenance</Text>}
                    </Flex>
                </Link>
                <Link href="/dashboard/areas" className="w-full">
                    <Flex align="center" gapX="3" className={getLinkClasses("/dashboard/areas")}>
                        <GridIcon className={isActive("/dashboard/areas") ? "text-white" : ""}/>
                        {isOpen && <Text {...TextConfig} color={undefined}>Areas</Text>}
                    </Flex>
                </Link>
            </Flex>
            <Separator orientation="horizontal" size="4" className="bg-border-strong opacity-100"/>
            <Flex direction="column" justify="start" align={isOpen ? "start" : "center"}
                  className="px-5 py-5" gap="4">
                <Link href="/dashboard/settings" className="w-full">
                    <Flex align="center" gapX="3" className={getLinkClasses("/dashboard/settings")}>
                        <GearIcon className={isActive("/dashboard/settings") ? "text-white" : ""}/>
                        {isOpen && <Text {...TextConfig} color={undefined} >Settings</Text>}
                    </Flex>
                </Link>
                <Link href="/dashboard/logout" className="w-full">
                    <Flex align="center" gapX="3" className={getLinkClasses("/dashboard/logout")}>
                        <ExitIcon className={isActive("/dashboard/logout") ? "text-white" : ""}/>
                        {isOpen && <Text {...TextConfig} color={undefined}>Logout</Text>}
                    </Flex>
                </Link>
            </Flex>
        </aside>
    );
}
