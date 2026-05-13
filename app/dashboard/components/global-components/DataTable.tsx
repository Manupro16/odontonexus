import {Table} from "@radix-ui/themes";
import {DataTableProps} from "@/lib/types";


export default function DataTable<T>({data, columns, getRowId}: DataTableProps<T>) {

    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    {columns.map((columns) => (
                        <Table.ColumnHeaderCell key={columns.id}>
                            {columns.header}
                        </Table.ColumnHeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((row) => (
                    <Table.Row key={getRowId(row)}>
                        {columns.map((column) =>
                            column.isRowHeader ? (
                                <Table.RowHeaderCell key={column.id}>
                                    {column.cell(row)}
                                </Table.RowHeaderCell>
                            ) : (
                                <Table.Cell key={column.id}>
                                    {column.cell(row)}
                                </Table.Cell>
                            )
                        )}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    )

}