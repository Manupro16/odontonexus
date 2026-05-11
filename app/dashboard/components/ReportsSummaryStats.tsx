import {Card, Flex, Grid, Heading, Text} from "@radix-ui/themes";
import {
    ActivityLogIcon,
    CheckCircledIcon,
    ExclamationTriangleIcon,
    TimerIcon
} from "@radix-ui/react-icons";

interface ReportsSummaryStatsProps {
    stats: {
        total: number;
        open: number;
        highPriority: number;
        resolvedThisMonth: number;
    }
}

export function ReportsSummaryStats({stats}: ReportsSummaryStatsProps) {
    return (
        <Grid columns={{ initial: "1", sm: "2", md: "4" }} gap="4">
            <Card size="2">
                <Flex direction="column" gap="2">
                    <Flex justify="between" align="center">
                        <Text size="1" color="gray" weight="bold" className="uppercase tracking-wider">Open Incidents</Text>
                        <ActivityLogIcon className="text-blue-500" width="20" height="20" />
                    </Flex>
                    <Heading size="6">{stats.open}</Heading>
                    <Text size="1" color="blue">Active maintenance requests</Text>
                </Flex>
            </Card>

            <Card size="2">
                <Flex direction="column" gap="2">
                    <Flex justify="between" align="center">
                        <Text size="1" color="gray" weight="bold" className="uppercase tracking-wider">Urgent Attention</Text>
                        <ExclamationTriangleIcon className="text-red-500" width="20" height="20" />
                    </Flex>
                    <Heading size="6">{stats.highPriority}</Heading>
                    <Text size="1" color="red">High priority unresolved</Text>
                </Flex>
            </Card>

            <Card size="2">
                <Flex direction="column" gap="2">
                    <Flex justify="between" align="center">
                        <Text size="1" color="gray" weight="bold" className="uppercase tracking-wider">Avg. Resolution</Text>
                        <TimerIcon className="text-orange-500" width="20" height="20" />
                    </Flex>
                    <Heading size="6">1.2d</Heading>
                    <Text size="1" color="orange">Estimated fix time</Text>
                </Flex>
            </Card>

            <Card size="2">
                <Flex direction="column" gap="2">
                    <Flex justify="between" align="center">
                        <Text size="1" color="gray" weight="bold" className="uppercase tracking-wider">Resolved</Text>
                        <CheckCircledIcon className="text-green-500" width="20" height="20" />
                    </Flex>
                    <Heading size="6">{stats.resolvedThisMonth}</Heading>
                    <Text size="1" color="green">Closed in last 30 days</Text>
                </Flex>
            </Card>
        </Grid>
    );
}
