import {Card, Flex, Grid, Heading, Text} from "@radix-ui/themes";
import {CalendarIcon, CheckCircledIcon, ClockIcon, ExclamationTriangleIcon} from "@radix-ui/react-icons";

interface MaintenanceKpiCardsProps {
    stats: {
        scheduled: number;
        dueToday: number;
        overdue: number;
        completed: number;
    };
}

export function MaintenanceKpiCards({stats}: MaintenanceKpiCardsProps) {
    return (
        <Grid columns={{initial: "1", sm: "2", lg: "4"}} gap="4">
            <Card size="1" className="bg-white/5 border-border-strong">
                <Flex direction="column" gap="1">
                    <Flex justify="between" align="center">
                        <Text size="1" color="gray" weight="medium" className="uppercase tracking-wider">Scheduled</Text>
                        <CalendarIcon className="text-blue-400"/>
                    </Flex>
                    <Heading size="5">{stats.scheduled}</Heading>
                </Flex>
            </Card>

            <Card size="1" className="bg-white/5 border-border-strong">
                <Flex direction="column" gap="1">
                    <Flex justify="between" align="center">
                        <Text size="1" color="gray" weight="medium" className="uppercase tracking-wider">Due Today</Text>
                        <ClockIcon className="text-amber-400"/>
                    </Flex>
                    <Heading size="5">{stats.dueToday}</Heading>
                </Flex>
            </Card>

            <Card size="1" className="bg-white/5 border-border-strong">
                <Flex direction="column" gap="1">
                    <Flex justify="between" align="center">
                        <Text size="1" color="gray" weight="medium" className="uppercase tracking-wider">Overdue</Text>
                        <ExclamationTriangleIcon className="text-red-400"/>
                    </Flex>
                    <Heading size="5">{stats.overdue}</Heading>
                </Flex>
            </Card>

            <Card size="1" className="bg-white/5 border-border-strong">
                <Flex direction="column" gap="1">
                    <Flex justify="between" align="center">
                        <Text size="1" color="gray" weight="medium" className="uppercase tracking-wider">Completed</Text>
                        <CheckCircledIcon className="text-green-400"/>
                    </Flex>
                    <Heading size="5">{stats.completed}</Heading>
                </Flex>
            </Card>
        </Grid>
    );
}
