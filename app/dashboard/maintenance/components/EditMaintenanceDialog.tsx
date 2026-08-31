import {MaintenanceItem, MaintenanceReportOption, MaintenanceUnitOption} from "@/lib/types";
import {MaintenanceFormDialog, MaintenanceFormPayload} from "./MaintenanceFormDialog";
import {useMemo} from "react";

export interface UpdateMaintenancePayload extends MaintenanceFormPayload {
    id: string;
}

interface EditMaintenanceDialogProps {
    item: MaintenanceItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: (payload: UpdateMaintenancePayload) => Promise<{ok: true} | {ok: false; error: string}>;
    availableUnits: MaintenanceUnitOption[];
    availableReports: MaintenanceReportOption[];
}

function canEditRecord(item: MaintenanceItem | null) {
    if (!item) {
        return false;
    }

    return item.status === "Scheduled" || item.status === "In Progress";
}

export function EditMaintenanceDialog({
    item,
    open,
    onOpenChange,
    onUpdate,
    availableUnits,
    availableReports
}: EditMaintenanceDialogProps) {
    const initialValues = useMemo(() => {
        if (!item) {
            return undefined;
        }

        return {
            unitId: item.unitId,
            reportId: item.relatedReport?.id ?? null,
            type: item.type,
            priority: item.priority,
            title: item.title,
            description: item.description,
            scheduledFor: item.scheduledFor ?? "",
            scheduledUntil: item.scheduledUntil
        };
    }, [item]);

    const handleUpdate = async (payload: MaintenanceFormPayload) => {
        if (!item) {
            return {
                ok: false as const,
                error: "This maintenance record is no longer available. Please refresh and try again."
            };
        }

        if (!canEditRecord(item)) {
            return {
                ok: false as const,
                error: "Completed and cancelled maintenance records are read-only."
            };
        }

        return onUpdate({
            id: item.id,
            ...payload
        });
    };

    return (
        <MaintenanceFormDialog
            open={open}
            onOpenChange={onOpenChange}
            onSubmit={handleUpdate}
            availableUnits={availableUnits}
            availableReports={availableReports}
            dialogTitle="Edit / Reschedule Maintenance"
            dialogDescription="Update maintenance planning metadata without changing lifecycle outcome fields."
            submitLabel="Save Changes"
            submittingLabel="Saving..."
            submitErrorMessage="We could not update maintenance right now. Please try again."
            initialValues={initialValues}
        />
    );
}
