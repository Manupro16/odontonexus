import {AREAS, UNIT_STATUSES} from "@/lib/constants";
import {UnitStatus} from "@/lib/types";
import {Button, Dialog, Flex, Select, Text, TextArea, TextField} from "@radix-ui/themes";
import {useMemo, useState} from "react";

export interface CreateUnitPayload {
    id: string;
    area: string;
    status: UnitStatus;
    observations?: string;
}

interface CreateUnitDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (payload: CreateUnitPayload) => void;
    existingUnitIds: string[];
    suggestedUnitId: string;
}

export function CreateUnitDialog({
    open,
    onOpenChange,
    onCreate,
    existingUnitIds,
    suggestedUnitId
}: CreateUnitDialogProps) {
    const [id, setId] = useState(suggestedUnitId);
    const [area, setArea] = useState<string>(AREAS[0] ?? "");
    const [status, setStatus] = useState<UnitStatus>("Operativa");
    const [observations, setObservations] = useState("");

    const resetForm = () => {
        setId(suggestedUnitId);
        setArea(AREAS[0] ?? "");
        setStatus("Operativa");
        setObservations("");
    };

    const hasDuplicateId = useMemo(() => {
        const normalized = id.trim().toLowerCase();
        if (!normalized) {
            return false;
        }

        return existingUnitIds.some((unitId) => unitId.toLowerCase() === normalized);
    }, [existingUnitIds, id]);

    const isSubmitDisabled = !id.trim() || !area || hasDuplicateId;

    const handleCreate = () => {
        if (isSubmitDisabled) {
            return;
        }

        onCreate({
            id: id.trim(),
            area,
            status,
            observations: observations.trim() || undefined
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
            <Dialog.Content maxWidth="520px">
                <Dialog.Title>Add New Unit</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Register a new dental unit so it can be monitored from the dashboard.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Unit ID
                        </Text>
                        <TextField.Root
                            placeholder="U-11"
                            value={id}
                            onChange={(event) => setId(event.target.value)}
                        />
                    </label>

                    {hasDuplicateId && (
                        <Text size="1" color="red">
                            This Unit ID already exists.
                        </Text>
                    )}

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
                            Initial Status
                        </Text>
                        <Select.Root value={status} onValueChange={(value) => setStatus(value as UnitStatus)}>
                            <Select.Trigger className="w-full" />
                            <Select.Content>
                                {UNIT_STATUSES.map((unitStatus) => (
                                    <Select.Item key={unitStatus} value={unitStatus}>
                                        {unitStatus}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Notes (Optional)
                        </Text>
                        <TextArea
                            placeholder="Add relevant notes for this unit"
                            rows={3}
                            value={observations}
                            onChange={(event) => setObservations(event.target.value)}
                        />
                    </label>
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                    <Button variant="soft" color="gray" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button color="blue" onClick={handleCreate} disabled={isSubmitDisabled}>
                        Create Unit
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}