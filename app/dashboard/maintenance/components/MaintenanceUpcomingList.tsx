import {Badge, Card, Flex, Heading, Table, Text} from "@radix-ui/themes";
import {MaintenanceItem} from "@/lib/types";

interface MaintenanceUpcomingListProps {
    items: MaintenanceItem[];
}

const statusToColor: Record<MaintenanceItem["status"], "blue" | "orange" | "green" | "gray"> = {
    Scheduled: "blue",
    "In Progress": "orange",
    Completed: "green",
    Cancelled: "gray"
};

function parseDate(value: string | null): Date | null {
    if (!value) {
        return null;
    }

    return new Date(value);
}

function toDisplay(value: string | null) {
    if (!value) {
        return "Unscheduled";
    }

    return new Date(value).toLocaleString();
}

export function MaintenanceUpcomingList({items}: MaintenanceUpcomingListProps) {
    const orderedItems = [...items].sort((first, second) => {
        const firstDate = parseDate(first.scheduledFor);
        const secondDate = parseDate(second.scheduledFor);

        if (firstDate && secondDate) {
            return firstDate.getTime() - secondDate.getTime();
        }

        if (firstDate) {
            return -1;
        }

        if (secondDate) {
            return 1;
        }

        return first.title.localeCompare(second.title);
    });

    return (
        <Card>
            <Flex direction="column" gap="3">
                <Heading size="4">Upcoming &amp; Unscheduled Maintenance</Heading>
                <Table.Root variant="surface">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>When</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {orderedItems.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell>
                                    <Text size="2">{toDisplay(item.scheduledFor)}</Text>
                                </Table.Cell>
                                <Table.Cell>{item.unitCode} · {item.area}</Table.Cell>
                                <Table.Cell>{item.type}</Table.Cell>
                                <Table.Cell>
                                    <Badge variant="soft" color={statusToColor[item.status]}>{item.status}</Badge>
                                </Table.Cell>
                                <Table.Cell>{item.title}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Flex>
        </Card>
    );
}
