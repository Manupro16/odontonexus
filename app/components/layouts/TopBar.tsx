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
    Avatar, ScrollArea, Strong,
    DropdownMenu,
    TextField
} from "@radix-ui/themes";

import {
    CheckCircledIcon,
    ChevronDownIcon,
    CubeIcon,
    DashboardIcon,
    DotsVerticalIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
    ExclamationTriangleIcon,
    ExitIcon,
    GearIcon,
    GridIcon,
    Half2Icon, MagnifyingGlassIcon, ResetIcon
} from "@radix-ui/react-icons"

export default function TopBar() {
    return (
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


    );
}