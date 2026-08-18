import {REPORT_PRIORITIES} from "@/lib/constants";
import {ReportPriority, ReportUnitOption} from "@/lib/types";
import {Button, Dialog, Flex, Select, Text, TextArea, TextField} from "@radix-ui/themes";
import {useEffect, useState} from "react";

export interface CreateReportPayload {
    unit: string;
    issue: string;
    priority: ReportPriority;
    reporter: string;
}

interface CreateReportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (payload: CreateReportPayload) => Promise<{ok: true} | {ok: false; error: string}>;
    availableUnits: ReportUnitOption[];
    preselectedUnitId?: string;
}

function resolveSelectedUnit(availableUnits: ReportUnitOption[], preselectedUnitId?: string) {
    if (preselectedUnitId && availableUnits.some((unit) => unit.unitCode === preselectedUnitId)) {
        return preselectedUnitId;
    }

    return availableUnits[0]?.unitCode ?? "";
}

function resolveSelectedArea(availableUnits: ReportUnitOption[], selectedUnitCode: string) {
    return availableUnits.find((unit) => unit.unitCode === selectedUnitCode)?.area ?? "";
}

export function CreateReportDialog({
    open,
    onOpenChange,
    onCreate,
    availableUnits,
    preselectedUnitId
}: CreateReportDialogProps) {
    const [unit, setUnit] = useState(() => resolveSelectedUnit(availableUnits, preselectedUnitId));
    const [issue, setIssue] = useState("");
    const [priority, setPriority] = useState<ReportPriority>("Medium");
    const [reporter, setReporter] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const selectedArea = resolveSelectedArea(availableUnits, unit);

    const resetForm = () => {
        setUnit(resolveSelectedUnit(availableUnits, preselectedUnitId));
        setIssue("");
        setPriority("Medium");
        setReporter("");
        setError(null);
    };

    useEffect(() => {
        if (!open) {
            return;
        }

        setUnit(resolveSelectedUnit(availableUnits, preselectedUnitId));
    }, [open, availableUnits, preselectedUnitId]);

    const isSubmitDisabled = !unit || !selectedArea || !issue.trim() || isSubmitting;

    const handleCreate = async () => {
        if (isSubmitDisabled) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const result = await onCreate({
            unit,
            issue: issue.trim(),
            priority,
            reporter: reporter.trim() || "Unknown"
        });

        setIsSubmitting(false);

        if (!result.ok) {
            setError(result.error);
            return;
        }

        resetForm();
        onOpenChange(false);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            resetForm();
        }

        onOpenChange(nextOpen);
    };

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Content maxWidth="540px">
                <Dialog.Title>Create Report</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Log a new issue so it appears in the incident pipeline.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Unit
                        </Text>
                        <Select.Root value={unit} onValueChange={setUnit}>
                            <Select.Trigger className="w-full" />
                            <Select.Content>
                                {availableUnits.map((unitOption) => (
                                    <Select.Item key={unitOption.unitCode} value={unitOption.unitCode}>
                                        {unitOption.unitCode}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Area
                        </Text>
                        <TextField.Root
                            value={selectedArea || "Select a unit to derive area"}
                            readOnly
                        />
                        <Text as="p" size="1" color="gray" mt="1">
                            Area is derived automatically from the selected unit.
                        </Text>
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Priority
                        </Text>
                        <Select.Root value={priority} onValueChange={(value) => setPriority(value as ReportPriority)}>
                            <Select.Trigger className="w-full" />
                            <Select.Content>
                                {REPORT_PRIORITIES.map((item) => (
                                    <Select.Item key={item} value={item}>
                                        {item}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Issue Description
                        </Text>
                        <TextArea
                            rows={4}
                            placeholder="Describe the issue"
                            value={issue}
                            onChange={(event) => setIssue(event.target.value)}
                        />
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Reporter
                        </Text>
                        <TextField.Root
                            placeholder="Name or ID"
                            value={reporter}
                            onChange={(event) => setReporter(event.target.value)}
                        />
                    </label>
                </Flex>

                {error && (
                    <Text size="2" color="red" mt="3" as="p">
                        {error}
                    </Text>
                )}

                <Flex gap="3" mt="4" justify="end">
                    <Button variant="soft" color="gray" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button color="blue" onClick={handleCreate} disabled={isSubmitDisabled}>
                        {isSubmitting ? "Creating..." : "Create Report"}
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}