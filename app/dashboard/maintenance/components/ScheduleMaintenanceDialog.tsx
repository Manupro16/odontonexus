import {MaintenanceReportOption, MaintenanceUnitOption} from "@/lib/types";
import {MaintenanceFormDialog, MaintenanceFormPayload} from "./MaintenanceFormDialog";

export type ScheduleMaintenancePayload = MaintenanceFormPayload;

interface ScheduleMaintenanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (payload: ScheduleMaintenancePayload) => Promise<{ok: true} | {ok: false; error: string}>;
    availableUnits: MaintenanceUnitOption[];
    availableReports: MaintenanceReportOption[];
}

export function ScheduleMaintenanceDialog({
    open,
    onOpenChange,
    onCreate,
    availableUnits,
    availableReports
}: ScheduleMaintenanceDialogProps) {
    return (
        <MaintenanceFormDialog
            open={open}
            onOpenChange={onOpenChange}
            onSubmit={onCreate}
            availableUnits={availableUnits}
            availableReports={availableReports}
            dialogTitle="Schedule Maintenance"
            dialogDescription="Plan a maintenance task that will appear on the operations calendar."
            submitLabel="Schedule Maintenance"
            submittingLabel="Scheduling..."
            submitErrorMessage="We could not schedule maintenance right now. Please try again."
        />
    );
}
