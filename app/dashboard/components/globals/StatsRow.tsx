import {Card, Flex, Grid, Heading, Text} from "@radix-ui/themes";
import {CheckCircledIcon, CubeIcon, ExclamationTriangleIcon, Half2Icon} from "@radix-ui/react-icons";

export interface UnitStats {
    total: number;
    functional: number;
    partial: number;
    nonFunctional: number;
}

interface StatsRowProps {
    stats: UnitStats;
}

export function StatsRow({stats}: StatsRowProps) {
    return (
        <Grid columns="4" gap="4">
            <Card size="1" className="bg-white/5 border-border-strong">
                <Flex direction="column" gap="1">
                    <Flex justify="between" align="center">
                        <Text size="1" color="gray" weight="medium" className="uppercase tracking-wider">Total
                            Units</Text>
                        <CubeIcon className="text-blue-400"/>
                    </Flex>
                    <Heading size="5">{stats.total}</Heading>
                </Flex>
            </Card>

            <Card size="1" className="bg-white/5 border-border-strong">
                <Flex direction="column" gap="1">
                    <Flex justify="between" align="center">
                        <Text size="1" color="gray" weight="medium"
                              className="uppercase tracking-wider">Functional</Text>
                        <CheckCircledIcon className="text-green-400"/>
                    </Flex>
                    <Heading size="5">{stats.functional}</Heading>
                </Flex>
            </Card>

            <Card size="1" className="bg-white/5 border-border-strong">
                <Flex direction="column" gap="1">
                    <Flex justify="between" align="center">
                        <Text size="1" color="gray" weight="medium"
                              className="uppercase tracking-wider">Partial</Text>
                        <Half2Icon className="text-yellow-400"/>
                    </Flex>
                    <Heading size="5">{stats.partial}</Heading>
                </Flex>
            </Card>

            <Card size="1" className="bg-white/5 border-border-strong">
                <Flex direction="column" gap="1">
                    <Flex justify="between" align="center">
                        <Text size="1" color="gray" weight="medium"
                              className="uppercase tracking-wider">Non-Functional</Text>
                        <ExclamationTriangleIcon className="text-red-400"/>
                    </Flex>
                    <Heading size="5">{stats.nonFunctional}</Heading>
                </Flex>
            </Card>
        </Grid>
    );
}
