import {Badge, Button, Dialog, Flex, Grid, Strong, Text} from "@radix-ui/themes";
import {MaintenanceItem} from "@/lib/types";

interface MaintenanceDetailsDialogProps {
    item: MaintenanceItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEditRequest: (item: MaintenanceItem) => void;
    onCompleteRequest: (item: MaintenanceItem) => void;
}

const statusToColor: Record<MaintenanceItem["status"], "blue" | "orange" | "green" | "gray"> = {
    Scheduled: "blue",
    "In Progress": "orange",
    Completed: "green",
    Cancelled: "gray"
};

const priorityToColor: Record<MaintenanceItem["priority"], "gray" | "orange" | "red"> = {
    Low: "gray",
    Medium: "orange",
    High: "red"
};

function toDisplay(value: string | null) {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleString();
}

function canEditRecord(item: MaintenanceItem) {
    return item.status === "Scheduled" || item.status === "In Progress";
}

function Row({label, value}: {label: string; value: React.ReactNode}) {
    return (
        <>
            <Text color="gray" size="2">{label}</Text>
            <Text size="2">{value}</Text>
        </>
    );
}

export function MaintenanceDetailsDialog({
    item,
    open,
    onOpenChange,
    onEditRequest,
    onCompleteRequest
}: MaintenanceDetailsDialogProps) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content maxWidth="680px">
                <Dialog.Title>Maintenance Detail</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Operational details for the selected maintenance record.
                </Dialog.Description>

                {!item ? null : (
                    <Flex direction="column" gap="3">
                        <Grid columns="2" gap="2">
                            <Row label="Unit" value={<Strong>{item.unitCode}</Strong>}/>
                            <Row label="Area" value={item.area}/>
                            <Row label="Title" value={item.title}/>
                            <Row label="Description" value={item.description ?? "—"}/>
                            <Row label="Type" value={item.type}/>
                            <Row label="Status" value={<Badge variant="soft" color={statusToColor[item.status]}>{item.status}</Badge>}/>
                            <Row label="Priority" value={<Badge variant="soft" color={priorityToColor[item.priority]}>{item.priority}</Badge>}/>
                            <Row label="Scheduled start" value={toDisplay(item.scheduledFor)}/>
                            <Row label="Scheduled end" value={toDisplay(item.scheduledUntil)}/>
                            <Row
                                label="Related Report"
                                value={item.relatedReport ? `${item.relatedReport.id.slice(0, 8)} · ${item.relatedReport.status}` : "—"}
                            />
                            <Row label="Performed date" value={toDisplay(item.performedAt)}/>
                            <Row label="Performed by" value={item.performedBy ?? "—"}/>
                            <Row label="Outcome" value={item.outcome ?? "—"}/>
                        </Grid>

                        {canEditRecord(item) ? (
                            <Flex justify="end" gap="2">
                                <Button color="blue" onClick={() => onEditRequest(item)}>
                                    Edit / Reschedule
                                </Button>
                                <Button color="green" onClick={() => onCompleteRequest(item)}>
                                    Complete Maintenance
                                </Button>
                            </Flex>
                        ) : (
                            <Text as="p" size="1" color="gray">
                                Completed and cancelled maintenance records are historical and read-only.
                            </Text>
                        )}
                    </Flex>
                )}
            </Dialog.Content>
        </Dialog.Root>
    );
}
