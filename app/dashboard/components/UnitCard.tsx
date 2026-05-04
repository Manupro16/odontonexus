import {Badge, Card, Flex, Grid, Strong, Text, Box, Tooltip, Separator, DropdownMenu, IconButton, Button} from "@radix-ui/themes";
import {DentalUnit, UnitStatus} from "@/lib/types";
import {
    CheckCircledIcon,
    DotsVerticalIcon,
    ExclamationTriangleIcon,
    InfoCircledIcon,
    MinusCircledIcon
} from "@radix-ui/react-icons";
import {UNIT_STATUSES} from "@/lib/constants";
import {UnitDetailsDialog} from "./UnitDetailsDialog";
import {ReportFailureDialog} from "./ReportFailureDialog";

interface UnitCardProps {
    unit: DentalUnit;
    onUpdateStatus?: (status: UnitStatus) => void;
}

export function UnitCard({unit, onUpdateStatus}: UnitCardProps) {
    const statusConfig = {
        "Operativa": {
            color: "green" as const, 
            dotClass: "bg-green-500",
            icon: <CheckCircledIcon/>
        },
        "Parcialmente Operativa": {
            color: "orange" as const, 
            dotClass: "bg-orange-500",
            icon: <ExclamationTriangleIcon/>
        },
        "Fuera de Servicio": {
            color: "red" as const, 
            dotClass: "bg-red-500",
            icon: <MinusCircledIcon/>
        }
    };

    const config = statusConfig[unit.status];

    return (
        <Card size="2">
            <Flex direction="column" gap="3">
                <Flex justify="between" align="center">
                    <Flex align="center"  gap="2">
                        <Box className={`w-3 h-3 rounded-full ${config.dotClass}`}/>
                        <Strong>{unit.id}</Strong>
                    </Flex>
                    <Flex align="center" gap="2">
                        <Badge color={config.color} variant="soft" className="gap-1">
                            {config.icon}
                            {unit.status}
                        </Badge>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <IconButton variant="ghost" color="gray" size="1">
                                    <DotsVerticalIcon/>
                                </IconButton>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                <UnitDetailsDialog 
                                    unit={unit} 
                                    trigger={<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>View Details</DropdownMenu.Item>} 
                                />
                                <ReportFailureDialog 
                                    unit={unit} 
                                    trigger={<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>Report Failure</DropdownMenu.Item>} 
                                />
                                <DropdownMenu.Separator />
                                <DropdownMenu.Sub>
                                    <DropdownMenu.SubTrigger>Update Status</DropdownMenu.SubTrigger>
                                    <DropdownMenu.SubContent>
                                        {UNIT_STATUSES.map(status => (
                                            <DropdownMenu.Item 
                                                key={status} 
                                                onClick={() => onUpdateStatus?.(status)}
                                                color={status === "Fuera de Servicio" ? "red" : undefined}
                                            >
                                                {status}
                                            </DropdownMenu.Item>
                                        ))}
                                    </DropdownMenu.SubContent>
                                </DropdownMenu.Sub>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </Flex>
                </Flex>

                <Flex direction="column" gap="1">
                    <Text size="2" color="gray">Area: <Strong>{unit.area}</Strong></Text>
                    <Flex align="center" gap="1">
                        <Text size="2" color="gray">Last Review:</Text>
                        <Text size="2" weight="bold" color="blue">
                            {unit.lastReview || "No data"}
                        </Text>
                    </Flex>
                </Flex>

                <Separator size="4" />


                <Box>
                    <Text size="1" weight="bold" color="gray" mb="2" as="div">COMPONENT HEALTH</Text>
                    <Grid columns="4" gap="2">
                        {Object.entries(unit.components).map(([name, isOk]) => (
                            <Tooltip key={name} content={name.replace(/([A-Z])/g, ' $1').trim()}>
                                <Box 
                                    className={`h-1.5 rounded-full ${isOk ? 'bg-green-500/40' : 'bg-red-500'}`}
                                />
                            </Tooltip>
                        ))}
                    </Grid>
                </Box>

                {unit.observations && (
                    <Flex gap="2" align="start" className="bg-gray-500/10 p-2 rounded text-gray-400">
                        <InfoCircledIcon className="mt-0.5"/>
                        <Text size="1">{unit.observations}</Text>
                    </Flex>
                )}

                <Flex gap="2" mt="1">
                    <UnitDetailsDialog
                        unit={unit}
                        trigger={
                            <Button variant="soft" color="gray" size="1" className="flex-1">
                                Review Unit
                            </Button>
                        }
                    />
                    <ReportFailureDialog
                        unit={unit}
                        trigger={
                            <Button variant="soft" color="red" size="1" className="flex-1">
                                <ExclamationTriangleIcon /> Delete Unit
                            </Button>
                        }
                    />
                </Flex>
            </Flex>
        </Card>
    );
}

