import {Box, DataList, Dialog, Badge, Flex, Grid, Strong, Text, Separator, Heading, Button} from "@radix-ui/themes";
import {DentalUnit} from "@/lib/types";
import {
    CheckCircledIcon,
    ExclamationTriangleIcon,
    MinusCircledIcon,
    CalendarIcon,
    InfoCircledIcon
} from "@radix-ui/react-icons";

interface UnitDetailsDialogProps {
    unit: DentalUnit;
    trigger: React.ReactNode;
}

export function UnitDetailsDialog({unit, trigger}: UnitDetailsDialogProps) {
    const statusConfig = {
        "Operativa": { color: "green" as const, icon: <CheckCircledIcon /> },
        "Parcialmente Operativa": { color: "orange" as const, icon: <ExclamationTriangleIcon /> },
        "Fuera de Servicio": { color: "red" as const, icon: <MinusCircledIcon /> }
    };

    const config = statusConfig[unit.status];

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                {trigger}
            </Dialog.Trigger>

            <Dialog.Content maxWidth="550px">
                <Dialog.Title>
                    <Flex align="center" gap="2">
                        Unit Details: {unit.id}
                        <Badge color={config.color} variant="soft" size="2">
                            {config.icon} {unit.status}
                        </Badge>
                    </Flex>
                </Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Complete technical specifications and health status for this dental unit.
                </Dialog.Description>

                <Flex direction="column" gap="4">
                    <Box>
                        <Heading size="3" mb="2">General Information</Heading>
                        <DataList.Root>
                            <DataList.Item align="center">
                                <DataList.Label color="gray">Area / Clinic</DataList.Label>
                                <DataList.Value>
                                    <Badge variant="soft" color="blue">{unit.area}</Badge>
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label color="gray">Last Review</DataList.Label>
                                <DataList.Value>
                                    <Flex align="center" gap="2">
                                        <CalendarIcon />
                                        <Text size="2">{unit.lastReview}</Text>
                                    </Flex>
                                </DataList.Value>
                            </DataList.Item>
                        </DataList.Root>
                    </Box>

                    <Separator size="4" />

                    <Box>
                        <Heading size="3" mb="2">Technical Specifications</Heading>
                        <DataList.Root>
                            <DataList.Item>
                                <DataList.Label color="gray">Brand</DataList.Label>
                                <DataList.Value>{unit.brand || "N/A"}</DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label color="gray">Model</DataList.Label>
                                <DataList.Value>{unit.model || "N/A"}</DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label color="gray">Serial Number</DataList.Label>
                                <DataList.Value>
                                    <Text family="mono" size="2">{unit.serialNumber || "N/A"}</Text>
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label color="gray">Installation Date</DataList.Label>
                                <DataList.Value>{unit.installationDate || "N/A"}</DataList.Value>
                            </DataList.Item>
                        </DataList.Root>
                    </Box>

                    <Separator size="4" />

                    <Box>
                        <Text size="2" weight="bold" color="gray" mb="2" as="div">COMPONENT HEALTH MATRIX</Text>
                        <Grid columns="2" gap="3">
                            {Object.entries(unit.components).map(([name, isOk]) => (
                                <Flex key={name} justify="between" align="center" className="bg-white/5 p-2 rounded">
                                    <Text size="2" className="capitalize">
                                        {name.replace(/([A-Z])/g, ' $1').trim()}
                                    </Text>
                                    <Badge color={isOk ? "green" : "red"} variant="surface">
                                        {isOk ? "Functional" : "Faulty"}
                                    </Badge>
                                </Flex>
                            ))}
                        </Grid>
                    </Box>

                    {unit.observations && (
                        <Box className="bg-gray-500/10 p-3 rounded border border-gray-500/20">
                            <Flex gap="2" align="start">
                                <InfoCircledIcon className="mt-1" />
                                <Box>
                                    <Strong size="2">Observations</Strong>
                                    <Text as="p" size="2" color="gray">
                                        {unit.observations}
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    )}
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">
                            Close
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}
