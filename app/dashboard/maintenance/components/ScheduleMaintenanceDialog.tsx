import {MaintenanceReportOption, MaintenanceUnitOption} from "@/lib/types";
import {Button, Dialog, Flex, Select, Text, TextArea, TextField} from "@radix-ui/themes";
import {useEffect, useMemo, useState} from "react";

export interface ScheduleMaintenancePayload {
    unitId: string;
    reportId?: string | null;
    type: "Preventive" | "Corrective" | "Inspection" | "Installation";
    priority: "Low" | "Medium" | "High";
    title: string;
    description?: string | null;
    scheduledFor: string;
    scheduledUntil?: string | null;
}

interface ScheduleMaintenanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (payload: ScheduleMaintenancePayload) => Promise<{ok: true} | {ok: false; error: string}>;
    availableUnits: MaintenanceUnitOption[];
    availableReports: MaintenanceReportOption[];
}

const MAINTENANCE_TYPES: ScheduleMaintenancePayload["type"][] = [
    "Preventive",
    "Corrective",
    "Inspection",
    "Installation"
];
const MAINTENANCE_PRIORITIES: ScheduleMaintenancePayload["priority"][] = ["Low", "Medium", "High"];
const NO_REPORT_VALUE = "__none__";

function resolveSelectedUnit(availableUnits: MaintenanceUnitOption[]) {
    return availableUnits[0]?.id ?? "";
}

function toIsoInstant(localDateTime: string) {
    const parsed = new Date(localDateTime);

    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return parsed.toISOString();
}

function toShortIssue(issue: string) {
    const trimmed = issue.trim();
    if (trimmed.length <= 80) {
        return trimmed;
    }

    return `${trimmed.slice(0, 77)}...`;
}

export function ScheduleMaintenanceDialog({
    open,
    onOpenChange,
    onCreate,
    availableUnits,
    availableReports
}: ScheduleMaintenanceDialogProps) {
    const [unitId, setUnitId] = useState<string | null>(null);
    const [type, setType] = useState<ScheduleMaintenancePayload["type"]>("Preventive");
    const [priority, setPriority] = useState<ScheduleMaintenancePayload["priority"]>("Medium");
    const [title, setTitle] = useState("");
    const [reportId, setReportId] = useState<string | null>(null);
    const [scheduledForLocal, setScheduledForLocal] = useState("");
    const [scheduledUntilLocal, setScheduledUntilLocal] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasUnits = availableUnits.length > 0;
    const selectedUnitId = unitId ?? resolveSelectedUnit(availableUnits);
    const selectedUnit = availableUnits.find((item) => item.id === selectedUnitId) ?? null;

    const reportsForUnit = useMemo(
        () => availableReports.filter((item) => item.unitId === selectedUnitId),
        [availableReports, selectedUnitId]
    );

    useEffect(() => {
        if (!reportId) {
            return;
        }

        if (!reportsForUnit.some((item) => item.id === reportId)) {
            setReportId(null);
        }
    }, [reportId, reportsForUnit]);

    const resetForm = () => {
        setUnitId(null);
        setType("Preventive");
        setPriority("Medium");
        setTitle("");
        setReportId(null);
        setScheduledForLocal("");
        setScheduledUntilLocal("");
        setDescription("");
        setIsSubmitting(false);
        setError(null);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            resetForm();
        }

        onOpenChange(nextOpen);
    };

    const isSubmitDisabled = !hasUnits || !selectedUnitId || !title.trim() || !scheduledForLocal || isSubmitting;

    const handleCreate = async () => {
        if (isSubmitDisabled) {
            return;
        }

        const scheduledFor = toIsoInstant(scheduledForLocal);
        if (!scheduledFor) {
            setError("Please provide a valid scheduled start date and time.");
            return;
        }

        let scheduledUntil: string | null = null;

        if (scheduledUntilLocal) {
            scheduledUntil = toIsoInstant(scheduledUntilLocal);

            if (!scheduledUntil) {
                setError("Please provide a valid scheduled end date and time.");
                return;
            }

            if (new Date(scheduledUntil).getTime() < new Date(scheduledFor).getTime()) {
                setError("Scheduled end cannot be earlier than the scheduled start.");
                return;
            }
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await onCreate({
                unitId: selectedUnitId,
                reportId,
                type,
                priority,
                title: title.trim(),
                description: description.trim() || null,
                scheduledFor,
                scheduledUntil
            });

            if (!result.ok) {
                setError(result.error);
                return;
            }

            handleOpenChange(false);
        } catch {
            setError("We could not schedule maintenance right now. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Content maxWidth="640px">
                <Dialog.Title>Schedule Maintenance</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Plan a maintenance task that will appear on the operations calendar.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Unit*
                        </Text>
                        <Select.Root value={selectedUnitId} onValueChange={setUnitId} disabled={!hasUnits}>
                            <Select.Trigger className="w-full" placeholder={hasUnits ? "Select unit" : "No units available"}/>
                            <Select.Content>
                                {availableUnits.map((unitOption) => (
                                    <Select.Item key={unitOption.id} value={unitOption.id}>
                                        {unitOption.unitCode} · {unitOption.area}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                        {!hasUnits ? (
                            <Text as="p" size="1" color="red" mt="1">
                                You need to create at least one Unit before scheduling maintenance.
                            </Text>
                        ) : null}
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Maintenance Type*
                        </Text>
                        <Select.Root value={type} onValueChange={(value) => setType(value as ScheduleMaintenancePayload["type"])}>
                            <Select.Trigger className="w-full" />
                            <Select.Content>
                                {MAINTENANCE_TYPES.map((item) => (
                                    <Select.Item key={item} value={item}>{item}</Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Priority*
                        </Text>
                        <Select.Root value={priority} onValueChange={(value) => setPriority(value as ScheduleMaintenancePayload["priority"])}>
                            <Select.Trigger className="w-full" />
                            <Select.Content>
                                {MAINTENANCE_PRIORITIES.map((item) => (
                                    <Select.Item key={item} value={item}>{item}</Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Title*
                        </Text>
                        <TextField.Root
                            value={title}
                            placeholder="e.g. Repair pedal mechanism"
                            onChange={(event) => setTitle(event.target.value)}
                        />
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Related Report
                        </Text>
                        <Select.Root
                            value={reportId ?? NO_REPORT_VALUE}
                            onValueChange={(value) => setReportId(value === NO_REPORT_VALUE ? null : value)}
                            disabled={!hasUnits || !selectedUnitId}
                        >
                            <Select.Trigger className="w-full" placeholder="No related report" />
                            <Select.Content>
                                <Select.Item value={NO_REPORT_VALUE}>No related report</Select.Item>
                                {reportsForUnit.map((report) => (
                                    <Select.Item key={report.id} value={report.id}>
                                        {report.unitCode} · {toShortIssue(report.issue)} · {report.status} · {report.priority}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                        <Text as="p" size="1" color="gray" mt="1">
                            Only active reports from the selected unit are shown.
                        </Text>
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Scheduled Start*
                        </Text>
                        <TextField.Root
                            type="datetime-local"
                            value={scheduledForLocal}
                            onChange={(event) => setScheduledForLocal(event.target.value)}
                        />
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Scheduled End
                        </Text>
                        <TextField.Root
                            type="datetime-local"
                            value={scheduledUntilLocal}
                            onChange={(event) => setScheduledUntilLocal(event.target.value)}
                        />
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Description / Notes
                        </Text>
                        <TextArea
                            rows={4}
                            value={description}
                            placeholder="Optional details for planning and execution"
                            onChange={(event) => setDescription(event.target.value)}
                        />
                    </label>

                    {selectedUnit ? (
                        <Text as="p" size="1" color="gray">
                            Selected unit area: {selectedUnit.area}
                        </Text>
                    ) : null}
                </Flex>

                {error ? (
                    <Text size="2" color="red" mt="3" as="p">
                        {error}
                    </Text>
                ) : null}

                <Flex gap="3" mt="4" justify="end">
                    <Button variant="soft" color="gray" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button color="blue" onClick={handleCreate} disabled={isSubmitDisabled}>
                        {isSubmitting ? "Scheduling..." : "Schedule Maintenance"}
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}
