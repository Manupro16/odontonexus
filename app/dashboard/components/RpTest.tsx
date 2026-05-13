import {Badge, Box, Checkbox, DropdownMenu, Flex, HoverCard, IconButton, Strong, Table, Text} from "@radix-ui/themes";
import {ChevronDownIcon, DotsVerticalIcon} from "@radix-ui/react-icons";
import {CommentsHoverCard} from "@/app/dashboard/components/globals/CommentsHoverCard";
import {Report, ReportStatus} from "@/lib/types";

interface ReportsTableProps {
    filteredData: Report[];
    handleSelectAll: (checked: boolean) => void;
    handleToggleStatus: (id: number, checked: boolean) => void;
    handleUpdateStatus: (id: number, newStatus: ReportStatus) => void;
}

export function RpTest({
                                 filteredData,
                                 handleSelectAll,
                                 handleToggleStatus,
                                 handleUpdateStatus
                             }: ReportsTableProps) {
    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>
                        <Flex gap="2" align="center">
                            <Checkbox
                                checked={
                                    filteredData.length > 0 && filteredData.every(item => item.status === "Closed")
                                        ? true
                                        : filteredData.some(item => item.status === "Closed")
                                            ? "indeterminate"
                                            : false
                                }
                                onCheckedChange={(checked) => handleSelectAll(checked === true)}
                            />
                            Unit #
                        </Flex>
                    </Table.ColumnHeaderCell>
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
                        <Table.RowHeaderCell>
                            <Flex gap="2" align="center">
                                <Checkbox
                                    checked={row.status === "Closed"}
                                    onCheckedChange={(checked) => handleToggleStatus(row.id, checked === true)}
                                />
                                {row.unit}
                            </Flex>
                        </Table.RowHeaderCell>
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
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                    <Box className="cursor-pointer hover:opacity-80 transition-opacity">
                                        <Badge variant="soft" color={
                                            row.status === "Open" ? "red" :
                                                row.status === "In Progress" ? "blue" : "green"
                                        } className="gap-1">
                                            {row.status}
                                            <ChevronDownIcon width="12" height="12"/>
                                        </Badge>
                                    </Box>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content>
                                    <DropdownMenu.Item onClick={() => handleUpdateStatus(row.id, "Open")}>
                                        <Flex gap="2" align="center">
                                            <Badge color="red" variant="soft" size="1">Open</Badge>
                                        </Flex>
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item onClick={() => handleUpdateStatus(row.id, "In Progress")}>
                                        <Flex gap="2" align="center">
                                            <Badge color="blue" variant="soft" size="1">In Progress</Badge>
                                        </Flex>
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item onClick={() => handleUpdateStatus(row.id, "Closed")}>
                                        <Flex gap="2" align="center">
                                            <Badge color="green" variant="soft" size="1">Closed</Badge>
                                        </Flex>
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
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
                                    <DropdownMenu.Item>View Details</DropdownMenu.Item>
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
