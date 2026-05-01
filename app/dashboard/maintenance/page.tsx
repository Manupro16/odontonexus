import {Flex, Heading, Text} from "@radix-ui/themes";

export default function MaintenancePage() {
    return (
        <Flex direction="column" gap="4">
            <Heading size="8">Maintenance Schedule</Heading>
            <Text size="4" color="gray">Plan and track routine maintenance for all equipment.</Text>
        </Flex>
    );
}
