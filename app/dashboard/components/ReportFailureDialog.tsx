import {Button, Dialog, Flex, Text, TextArea, TextField, Select, Box} from "@radix-ui/themes";
import {DentalUnit} from "@/lib/types";
import {ExclamationTriangleIcon} from "@radix-ui/react-icons";

interface ReportFailureDialogProps {
    unit: DentalUnit;
    trigger: React.ReactNode;
}

export function ReportFailureDialog({unit, trigger}: ReportFailureDialogProps) {
    const components = Object.keys(unit.components);

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                {trigger}
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
                <Dialog.Title>
                    <Flex align="center" gap="2">
                        <ExclamationTriangleIcon color="red" />
                        Report Failure: {unit.id}
                    </Flex>
                </Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Please specify which component is failing and provide a brief description of the issue.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                    <Box>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Failing Component
                        </Text>
                        <Select.Root defaultValue={components[0]}>
                            <Select.Trigger className="w-full" />
                            <Select.Content>
                                {components.map(comp => (
                                    <Select.Item key={comp} value={comp} className="capitalize">
                                        {comp.replace(/([A-Z])/g, ' $1').trim()}
                                    </Select.Item>
                                ))}
                                <Select.Item value="other">Other / General</Select.Item>
                            </Select.Content>
                        </Select.Root>
                    </Box>

                    <Box>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Issue Description
                        </Text>
                        <TextArea 
                            placeholder="Describe what is happening (e.g., 'Lamp flickering', 'Pedal stuck')" 
                            rows={3}
                        />
                    </Box>

                    <Box>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Reporter (Optional)
                        </Text>
                        <TextField.Root placeholder="Your name or ID" />
                    </Box>
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">
                            Cancel
                        </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button color="red">
                            Submit Report
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}
