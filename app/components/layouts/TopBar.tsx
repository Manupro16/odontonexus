'use client'

import {Button, Flex, Heading, Text} from "@radix-ui/themes";
import {usePathname} from "next/navigation";

const routeConfig: Record<string, { title: string; subtitle: string }> = {
    "/dashboard": {
        title: "Dashboard",
        subtitle: "Overview of your dental practice's operations"
    },
    "/dashboard/units": {
        title: "Units",
        subtitle: "Manage and monitor your dental units"
    },
    "/dashboard/reports": {
        title: "Reports",
        subtitle: "Analyze performance and maintenance logs"
    },
    "/dashboard/maintenance": {
        title: "Maintenance",
        subtitle: "Schedule and track unit repairs"
    },
    "/dashboard/areas": {
        title: "Areas",
        subtitle: "Organize units by clinic zones"
    },
    "/settings": {
        title: "Settings",
        subtitle: "Configure your account and application preferences"
    },
    "/dashboard/settings": {
        title: "Settings",
        subtitle: "Configure your account and application preferences"
    }
};

export default function TopBar() {
    const pathname = usePathname();
    
    const currentRoute = routeConfig[pathname] || {
        title: "Dashboard",
        subtitle: "Overview of your dental practice's operations"
    };

    return (
        <header className="row-start-1 col-start-2 border-b border-border-strong px-6">
            <Flex justify="between" align="center" className="h-full">
                <Flex direction="column" justify="center" align="start">
                    <Heading>{currentRoute.title}</Heading>
                    <Text color="gray">
                        {currentRoute.subtitle}
                    </Text>
                </Flex>
                <Flex align="center" gap="3">
                    <Button color="blue">Report Failure</Button>
                </Flex>
            </Flex>
        </header>
    );
}