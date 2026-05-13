import {
  Badge,
  Box,
  Checkbox,
  DropdownMenu,
  Flex,
  HoverCard,
  IconButton,
  Strong,
  Text,
} from "@radix-ui/themes";
import { ChevronDownIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { CommentsHoverCard } from "@/app/dashboard/components/globals/CommentsHoverCard";
import {DataTableColumn, Report, ReportsTableProps, ReportStatus} from "@/lib/types";
import DataTable from "@/app/dashboard/components/globals/DataTable";



export function ReportsTable({
  filteredData,
  handleSelectAll,
  handleToggleStatus,
  handleUpdateStatus,
}: ReportsTableProps) {
  const columns: DataTableColumn<Report>[] = [
    {
      id: "unit",
      header: (
        <Flex gap="2" align="center">
          <Checkbox
            checked={
              filteredData.length > 0 && filteredData.every((item) => item.status === "Closed")
                ? true
                : filteredData.some((item) => item.status === "Closed")
                ? "indeterminate"
                : false
            }
            onCheckedChange={(checked) => handleSelectAll(checked === true)}
          />
          Unit #
        </Flex>
      ),
      isRowHeader: true,
      cell: (row) => (
        <Flex gap="2" align="center">
          <Checkbox
            checked={row.status === "Closed"}
            onCheckedChange={(checked) => handleToggleStatus(row.id, checked === true)}
          />
          {row.unit}
        </Flex>
      ),
    },
    {
      id: "issue",
      header: "Component / Issue",
      cell: (row) => row.issue,
    },
    {
      id: "area",
      header: "Area",
      cell: (row) => <Badge variant="outline" color="gray">{row.area}</Badge>,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Box className="cursor-pointer hover:opacity-80 transition-opacity">
              <Badge
                variant="soft"
                color={
                  row.status === "Open"
                    ? "red"
                    : row.status === "In Progress"
                    ? "blue"
                    : "green"
                }
                className="gap-1"
              >
                {row.status}
                <ChevronDownIcon width="12" height="12" />
              </Badge>
            </Box>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item onClick={() => handleUpdateStatus(row.id, "Open")}>
              Open
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => handleUpdateStatus(row.id, "In Progress")}>
              In Progress
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => handleUpdateStatus(row.id, "Closed")}>
              Closed
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ),
    },
    {
      id: "comments",
      header: "Comments",
      cell: () => (
        <HoverCard.Root>
          <HoverCard.Trigger>
            <Text color="blue" className="cursor-pointer hover:underline">
              <Strong>Comments</Strong>
            </Text>
          </HoverCard.Trigger>
          <HoverCard.Content maxWidth="400px">
            <CommentsHoverCard />
          </HoverCard.Content>
        </HoverCard.Root>
      ),
    },
    {
      id: "extra",
      header: "Extra",
      cell: () => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="ghost" color="gray">
              <DotsVerticalIcon />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>View Details</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ),
    },
  ];

  return (
    <DataTable
      data={filteredData}
      columns={columns}
      getRowId={(row) => row.id}
    />
  );
}