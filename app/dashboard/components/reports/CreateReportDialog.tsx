import {AREAS, REPORT_PRIORITIES} from "@/lib/constants";
import {ReportPriority} from "@/lib/types";
import {Button, Dialog, Flex, Select, Text, TextArea, TextField} from "@radix-ui/themes";
import {useState} from "react";

export interface CreateReportPayload {
    unit: string;
    issue: string;
    area: string;
    priority: ReportPriority;
    reporter: string;
}

interface CreateReportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (payload: CreateReportPayload) => void;
    availableUnits: string[];
}

export function CreateReportDialog({
    open,
    onOpenChange,
    onCreate,
    availableUnits
}: CreateReportDialogProps) {
    const [unit, setUnit] = useState(availableUnits[0] ?? "");
    const [issue, setIssue] = useState("");
    const [area, setArea] = useState<string>(AREAS[0] ?? "");
    const [priority, setPriority] = useState<ReportPriority>("Medium");
    const [reporter, setReporter] = useState("");

    const resetForm = () => {
        setUnit(availableUnits[0] ?? "");
        setIssue("");
        setArea(AREAS[0] ?? "");
        setPriority("Medium");
        setReporter("");
    };

    const isSubmitDisabled = !unit || !issue.trim() || !area;

    const handleCreate = () => {
        if (isSubmitDisabled) {
            return;
        }

        onCreate({
            unit,
            issue: issue.trim(),
            area,
            priority,
            reporter: reporter.trim() || "Unknown"
        });

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
                                {availableUnits.map((unitId) => (
                                    <Select.Item key={unitId} value={unitId}>
                                        {unitId}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Area
                        </Text>
                        <Select.Root value={area} onValueChange={setArea}>
                            <Select.Trigger className="w-full" />
                            <Select.Content>
                                {AREAS.map((item) => (
                                    <Select.Item key={item} value={item}>
                                        {item}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
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

                <Flex gap="3" mt="4" justify="end">
                    <Button variant="soft" color="gray" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button color="blue" onClick={handleCreate} disabled={isSubmitDisabled}>
                        Create Report
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}