import {Flex, Heading, Text} from "@radix-ui/themes";

export default function SettingsPage() {
    return (
        <Flex direction="column" gap="4">
            <Heading size="8">Account Settings</Heading>
            <Text size="4" color="gray">Manage your profile, notifications, and application preferences.</Text>
        </Flex>
    );
}
