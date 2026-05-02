import {Badge, Card, Flex, Grid, Strong, Text, Box, Tooltip, Separator} from "@radix-ui/themes";
import {DentalUnit} from "@/lib/types";
import {
    CheckCircledIcon,
    ExclamationTriangleIcon,
    InfoCircledIcon,
    MinusCircledIcon
} from "@radix-ui/react-icons";

interface UnitCardProps {
    unit: DentalUnit;
}

export function UnitCard({unit}: UnitCardProps) {
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
                    <Badge color={config.color} variant="soft" className="gap-1">
                        {config.icon}
                        {unit.status}
                    </Badge>
                </Flex>

                <Flex direction="column" gap="1">
                    <Text size="2" color="gray">Area: <Strong>{unit.area}</Strong></Text>
                    <Text size="1" color="gray">Last Check: {unit.lastMaintenance}</Text>
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
            </Flex>
        </Card>
    );
}

