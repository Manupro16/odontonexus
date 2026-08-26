import Link from "next/link";
import {Badge, DropdownMenu, Flex, HoverCard, IconButton, Strong, Table, Text} from "@radix-ui/themes";
import {DotsVerticalIcon} from "@radix-ui/react-icons";
import {CommentsHoverCard} from "@/app/dashboard/components/globals/CommentsHoverCard";
import {Report} from "@/lib/types";

interface ReportsTableProps {
    filteredData: Report[];
}

export function RpTest({
                                 filteredData
                             }: ReportsTableProps) {
    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Unit #</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Component / Issue</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Area</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Reporter</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Priority</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Comments</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Extra</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {filteredData.map((row) => (
                    <Table.Row key={row.id}>
                        <Table.RowHeaderCell>{row.unit}</Table.RowHeaderCell>
                        <Table.Cell>{row.issue}</Table.Cell>
                        <Table.Cell>
                            <Badge variant="outline" color="gray">{row.area}</Badge>
                        </Table.Cell>
                        <Table.Cell>
                            <Text size="2">{row.reporter}</Text>
                        </Table.Cell>
                        <Table.Cell>
                            <Text size="1" color="gray">{row.createdAt}</Text>
                        </Table.Cell>
                        <Table.Cell>
                            <Badge variant="soft" color={
                                row.status === "Open" ? "red" :
                                    row.status === "In Progress" ? "blue" : "green"
                            }>
                                {row.status}
                            </Badge>
                        </Table.Cell>
                        <Table.Cell>
                            <Badge color={row.priorityColor}>{row.priority}</Badge>
                        </Table.Cell>
                        <Table.Cell>
                            <HoverCard.Root>
                                <HoverCard.Trigger>
                                    <Text color="blue" className="cursor-pointer hover:underline">
                                        <Strong>Comments</Strong>
                                    </Text>
                                </HoverCard.Trigger>
                                <HoverCard.Content maxWidth="400px">
                                    <CommentsHoverCard/>
                                </HoverCard.Content>
                            </HoverCard.Root>
                        </Table.Cell>
                        <Table.Cell>
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                    <IconButton variant="ghost" color="gray">
                                        <DotsVerticalIcon/>
                                    </IconButton>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content>
                                    <DropdownMenu.Item asChild>
                                        <Link href="/dashboard/reports">Manage in Reports</Link>
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item>Edit Unit</DropdownMenu.Item>
                                    <DropdownMenu.Separator/>
                                    <DropdownMenu.Item>Assign Maintenance</DropdownMenu.Item>
                                    <DropdownMenu.Item color="red">Mark Out of Service</DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
