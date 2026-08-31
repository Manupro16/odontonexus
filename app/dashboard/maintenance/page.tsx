import {
    Badge,
    Card,
    Flex,
    Heading,
    Separator,
    Table,
    Text
} from "@radix-ui/themes";
import {
    MaintenanceOutcome as PrismaMaintenanceOutcome,
    MaintenancePriority as PrismaMaintenancePriority,
    MaintenanceStatus as PrismaMaintenanceStatus,
    MaintenanceType as PrismaMaintenanceType,
    ReportStatus as PrismaReportStatus
} from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import {MaintenanceItem} from "@/lib/types";

const maintenanceTypeFromPrisma: Record<PrismaMaintenanceType, MaintenanceItem["type"]> = {
    PREVENTIVE: "Preventive",
    CORRECTIVE: "Corrective",
    INSTALLATION: "Installation",
    INSPECTION: "Inspection"
};

const maintenanceStatusFromPrisma: Record<PrismaMaintenanceStatus, MaintenanceItem["status"]> = {
    SCHEDULED: "Scheduled",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled"
};

const maintenancePriorityFromPrisma: Record<PrismaMaintenancePriority, MaintenanceItem["priority"]> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High"
};

const maintenanceOutcomeFromPrisma: Record<PrismaMaintenanceOutcome, Exclude<MaintenanceItem["outcome"], null>> = {
    COMPLETED: "Completed",
    PARTIAL: "Partial",
    FAILED: "Failed"
};

const reportStatusFromPrisma: Record<PrismaReportStatus, NonNullable<MaintenanceItem["relatedReport"]>["status"]> = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    CLOSED: "Closed"
};

function toIsoDateTime(date: Date | null): string | null {
    return date ? date.toISOString() : null;
}

async function getMaintenanceItems(): Promise<MaintenanceItem[]> {
    const records = await prisma.maintenanceRecord.findMany({
        include: {
            unit: {
                select: {
                    id: true,
                    unitCode: true,
                    area: {
                        select: {
                            displayName: true
                        }
                    }
                }
            },
            report: {
                select: {
                    id: true,
                    issueDescription: true,
                    status: true
                }
            },
            performedBy: {
                select: {
                    fullName: true
                }
            }
        },
        orderBy: [
            {scheduledFor: "asc"},
            {scheduledUntil: "asc"},
            {createdAt: "asc"}
        ]
    });

    return records.map((record) => ({
        id: record.id,
        unitId: record.unit.id,
        unitCode: record.unit.unitCode,
        area: record.unit.area.displayName,
        type: maintenanceTypeFromPrisma[record.type],
        status: maintenanceStatusFromPrisma[record.status],
        priority: maintenancePriorityFromPrisma[record.priority],
        outcome: record.outcome ? maintenanceOutcomeFromPrisma[record.outcome] : null,
        title: record.title,
        description: record.description,
        scheduledFor: toIsoDateTime(record.scheduledFor),
        scheduledUntil: toIsoDateTime(record.scheduledUntil),
        performedAt: toIsoDateTime(record.performedAt),
        performedBy: record.performedBy?.fullName ?? null,
        relatedReport: record.report
            ? {
                id: record.report.id,
                issue: record.report.issueDescription,
                status: reportStatusFromPrisma[record.report.status]
            }
            : null
    }));
}

export default async function MaintenancePage() {
    const maintenanceItems = await getMaintenanceItems();

    return (
        <Flex direction="column" gap="4">
            <Heading size="8">Maintenance Planning &amp; Operations</Heading>
            <Text size="4" color="gray">
                Plan and track routine maintenance for all equipment.
            </Text>
            <Text size="3" color="gray">
                {maintenanceItems.length} maintenance record{maintenanceItems.length === 1 ? "" : "s"}
            </Text>
            <Separator size="4"/>

            {maintenanceItems.length === 0 ? (
                <Card>
                    <Flex direction="column" gap="2" align="center" justify="center" py="6">
                        <Heading size="5">No maintenance scheduled</Heading>
                        <Text color="gray">Create the first maintenance entry to start planning operations.</Text>
                    </Flex>
                </Card>
            ) : (
                <Table.Root variant="surface">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Scheduled For</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Priority</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Related Report</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Performed By</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {maintenanceItems.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell>{item.scheduledFor ? item.scheduledFor.slice(0, 16).replace("T", " ") : "—"}</Table.Cell>
                                <Table.Cell>{item.unitCode} · {item.area}</Table.Cell>
                                <Table.Cell>{item.type}</Table.Cell>
                                <Table.Cell>
                                    <Badge
                                        variant="soft"
                                        color={
                                            item.status === "Scheduled"
                                                ? "blue"
                                                : item.status === "In Progress"
                                                    ? "orange"
                                                    : item.status === "Completed"
                                                        ? "green"
                                                        : "gray"
                                        }
                                    >
                                        {item.status}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell>{item.priority}</Table.Cell>
                                <Table.Cell>{item.title}</Table.Cell>
                                <Table.Cell>{item.relatedReport ? `${item.relatedReport.id.slice(0, 8)} · ${item.relatedReport.status}` : "—"}</Table.Cell>
                                <Table.Cell>{item.performedBy ?? "—"}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            )}
        </Flex>
    );
}
