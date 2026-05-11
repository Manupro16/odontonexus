'use client'

import {
    Badge,
    Box,
    Button,
    Card,
    DataList,
    Flex,
    Grid,
    Heading,
    Separator,
    Strong,
    Text
} from "@radix-ui/themes";
import {
    ArrowLeftIcon,
    CalendarIcon,
    CheckCircledIcon,
    ExclamationTriangleIcon,
    InfoCircledIcon,
    MinusCircledIcon,
    GearIcon,
    ClockIcon,
    FileTextIcon
} from "@radix-ui/react-icons";
import {DentalUnit} from "@/lib/types";
import {useRouter} from "next/navigation";

interface UnitDetailViewProps {
    unit: DentalUnit;
}

export function UnitDetailView({unit}: UnitDetailViewProps) {
    const router = useRouter();

    const statusConfig = {
        "Operativa": { color: "green" as const, icon: <CheckCircledIcon /> },
        "Parcialmente Operativa": { color: "orange" as const, icon: <ExclamationTriangleIcon /> },
        "Fuera de Servicio": { color: "red" as const, icon: <MinusCircledIcon /> }
    };

    const config = statusConfig[unit.status];

    return (
        <Flex direction="column" gap="4">
            {/* Header Actions */}
            <Flex justify="between" align="center">
                <Button variant="ghost" color="gray" onClick={() => router.back()}>
                    <ArrowLeftIcon /> Back to Units
                </Button>
                <Flex gap="3">
                    <Button variant="soft" color="gray">
                        <GearIcon /> Edit Unit
                    </Button>
                    <Button variant="solid" color="red">
                        <ExclamationTriangleIcon /> Report Failure
                    </Button>
                </Flex>
            </Flex>

            {/* Main Title & Status */}
            <Card size="3">
                <Flex justify="between" align="center">
                    <Flex direction="column" gap="1">
                        <Text size="2" color="gray">Dental Unit</Text>
                        <Heading size="8">{unit.id}</Heading>
                    </Flex>
                    <Flex direction="column" align="end" gap="2">
                        <Badge color={config.color} variant="soft" size="3">
                            {config.icon} {unit.status}
                        </Badge>
                        <Text size="2" color="gray">
                            Last Review: <Strong>{unit.lastReview}</Strong>
                        </Text>
                    </Flex>
                </Flex>
            </Card>

            <Grid columns={{ initial: "1", md: "3" }} gap="4">
                {/* Left Column: Technical Specifications */}
                <Box className="md:col-span-2">
                    <Flex direction="column" gap="4">
                        <Card size="3">
                            <Heading size="4" mb="4">Technical Specifications</Heading>
                            <DataList.Root orientation={{ initial: "vertical", sm: "horizontal" }}>
                                <DataList.Item>
                                    <DataList.Label color="gray">Area / Clinic</DataList.Label>
                                    <DataList.Value>
                                        <Badge variant="soft" color="blue">{unit.area}</Badge>
                                    </DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label color="gray">Brand</DataList.Label>
                                    <DataList.Value>{unit.brand || "Not specified"}</DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label color="gray">Model</DataList.Label>
                                    <DataList.Value>{unit.model || "Not specified"}</DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label color="gray">Serial Number</DataList.Label>
                                    <DataList.Value>
                                        <Text size="2" className="font-mono">{unit.serialNumber || "N/A"}</Text>
                                    </DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label color="gray">Installation Date</DataList.Label>
                                    <DataList.Value>
                                        <Flex align="center" gap="2">
                                            <CalendarIcon />
                                            {unit.installationDate || "No data"}
                                        </Flex>
                                    </DataList.Value>
                                </DataList.Item>
                            </DataList.Root>
                        </Card>

                        {/* Observations */}
                        <Card size="3">
                            <Heading size="4" mb="3">
                                <Flex align="center" gap="2">
                                    <FileTextIcon /> Observations
                                </Flex>
                            </Heading>
                            {unit.observations ? (
                                <Box className="bg-gray-500/5 p-4 rounded-lg border border-gray-500/10">
                                    <Text size="2" color="gray" as="p">
                                        {unit.observations}
                                    </Text>
                                </Box>
                            ) : (
                                <Text size="2" color="gray">No observations recorded for this unit.</Text>
                            )}
                        </Card>
                    </Flex>
                </Box>

                {/* Right Column: Component Health */}
                <Box>
                    <Card size="3">
                        <Heading size="4" mb="4">Component Health</Heading>
                        <Flex direction="column" gap="3">
                            {Object.entries(unit.components).map(([name, isOk]) => (
                                <Flex key={name} justify="between" align="center" className="bg-gray-500/5 p-3 rounded-lg">
                                    <Text size="2" weight="medium" className="capitalize">
                                        {name.replace(/([A-Z])/g, ' $1').trim()}
                                    </Text>
                                    <Badge color={isOk ? "green" : "red"} variant="surface">
                                        {isOk ? "Functional" : "Faulty"}
                                    </Badge>
                                </Flex>
                            ))}
                        </Flex>
                        <Separator size="4" my="4" />
                        <Button variant="outline" color="gray" className="w-full">
                            Complete Health Check
                        </Button>
                    </Card>
                </Box>
            </Grid>

            {/* Maintenance History Timeline Placeholder */}
            <Card size="3">
                <Flex align="center" gap="2" mb="4">
                    <ClockIcon />
                    <Heading size="4">Maintenance History</Heading>
                </Flex>
                
                <Flex direction="column" gap="4">
                    <Flex gap="4" align="start">
                        <Box className="relative">
                            <Box className="w-3 h-3 rounded-full bg-green-500 mt-1.5" />
                            <Box className="absolute top-6 left-1.5 w-0.5 h-full bg-gray-500/20" />
                        </Box>
                        <Box flexGrow="1">
                            <Flex justify="between" align="center" mb="1">
                                <Text size="2" weight="bold">Preventive Maintenance Completed</Text>
                                <Text size="1" color="gray">2024-04-15</Text>
                            </Flex>
                            <Text size="2" color="gray">General cleaning and lubrication of all moving parts. All systems verified.</Text>
                        </Box>
                    </Flex>

                    <Flex gap="4" align="start">
                        <Box className="relative">
                            <Box className="w-3 h-3 rounded-full bg-orange-500 mt-1.5" />
                            <Box className="absolute top-6 left-1.5 w-0.5 h-full bg-gray-500/20" />
                        </Box>
                        <Box flexGrow="1">
                            <Flex justify="between" align="center" mb="1">
                                <Text size="2" weight="bold">Partial Repair - Lamp</Text>
                                <Text size="1" color="gray">2024-03-20</Text>
                            </Flex>
                            <Text size="2" color="gray">Bulb replacement. Reported flicker still persists occasionally.</Text>
                        </Box>
                    </Flex>

                    <Flex gap="4" align="start">
                        <Box className="relative">
                            <Box className="w-3 h-3 rounded-full bg-blue-500 mt-1.5" />
                        </Box>
                        <Box flexGrow="1">
                            <Flex justify="between" align="center" mb="1">
                                <Text size="2" weight="bold">Unit Installed</Text>
                                <Text size="1" color="gray">2022-01-10</Text>
                            </Flex>
                            <Text size="2" color="gray">Initial installation and calibration by authorized technician.</Text>
                        </Box>
                    </Flex>
                </Flex>
                
                <Box mt="6">
                    <Button variant="ghost" color="gray" size="2">
                        View Full History Log
                    </Button>
                </Box>
            </Card>
        </Flex>
    );
}
