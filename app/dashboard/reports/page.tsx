import {Flex, Heading, Text} from "@radix-ui/themes";

export default function ReportsPage() {
    return (
        <Flex direction="column" gap="4">
            <Heading size="8">Reports & Analytics</Heading>
            <Text size="4" color="gray">View detailed performance and maintenance reports here.</Text>
        </Flex>
    );
}
