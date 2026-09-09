import {Button, Dialog, Flex, Grid, Select, Strong, Text} from "@radix-ui/themes";
import {MaintenanceItem} from "@/lib/types";
import {useMemo, useState} from "react";

export interface CompleteMaintenancePayload {
    id: string;
    outcome: Exclude<MaintenanceItem["outcome"], null>;
}

interface CompleteMaintenanceDialogProps {
    item: MaintenanceItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (payload: CompleteMaintenancePayload) => Promise<{ok: true} | {ok: false; error: string}>;
}

const completionOutcomes: CompleteMaintenancePayload["outcome"][] = ["Completed", "Partial", "Failed"];

function toDisplay(value: string | null) {
    if (!value) {
        return "Unscheduled";
    }

    return new Date(value).toLocaleString();
}

function Row({label, value}: {label: string; value: React.ReactNode}) {
    return (
        <>
            <Text color="gray" size="2">{label}</Text>
            <Text size="2">{value}</Text>
        </>
    );
}

export function CompleteMaintenanceDialog({item, open, onOpenChange, onSubmit}: CompleteMaintenanceDialogProps) {
    const [outcome, setOutcome] = useState<CompleteMaintenancePayload["outcome"]>("Completed");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isSubmitDisabled = isSubmitting || !item;
    const selectedOutcome = useMemo(() => {
        if (completionOutcomes.includes(outcome)) {
            return outcome;
        }

        return "Completed" as const;
    }, [outcome]);

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen && isSubmitting) {
            return;
        }

        if (!nextOpen) {
            setOutcome("Completed");
            setError(null);
            setIsSubmitting(false);
        }

        onOpenChange(nextOpen);
    };

    const handleSubmit = async () => {
        if (!item || isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await onSubmit({
                id: item.id,
                outcome: selectedOutcome
            });

            if (!result.ok) {
                setError(result.error);
                return;
            }

            handleOpenChange(false);
        } catch {
            setError("We could not complete maintenance right now. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Content maxWidth="560px">
                <Dialog.Title>Complete Maintenance</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Confirm completion and record outcome for this maintenance record.
                </Dialog.Description>

                {!item ? null : (
                    <Flex direction="column" gap="3">
                        <Grid columns="2" gap="2">
                            <Row label="Unit" value={<Strong>{item.unitCode}</Strong>}/>
                            <Row label="Title" value={item.title}/>
                            <Row label="Maintenance type" value={item.type}/>
                            <Row label="Scheduled date/time" value={toDisplay(item.scheduledFor)}/>
                        </Grid>

                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Outcome*
                            </Text>
                            <Select.Root
                                value={selectedOutcome}
                                onValueChange={(value) => setOutcome(value as CompleteMaintenancePayload["outcome"])}
                            >
                                <Select.Trigger className="w-full"/>
                                <Select.Content>
                                    {completionOutcomes.map((itemOutcome) => (
                                        <Select.Item key={itemOutcome} value={itemOutcome}>{itemOutcome}</Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Root>
                        </label>
                    </Flex>
                )}

                {error ? (
                    <Text size="2" color="red" mt="3" as="p">
                        {error}
                    </Text>
                ) : null}

                <Flex gap="3" mt="4" justify="end">
                    <Button variant="soft" color="gray" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button color="green" onClick={handleSubmit} disabled={isSubmitDisabled}>
                        {isSubmitting ? "Completing..." : "Complete Maintenance"}
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}