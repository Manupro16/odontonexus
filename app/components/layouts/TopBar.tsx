import {Button, Flex, Heading, Text} from "@radix-ui/themes";

export default function TopBar() {
    return (
        <header className="row-start-1 col-start-2 border-b border-border-strong px-6">
            <Flex justify="between" align="center" className="h-full">
                <Flex direction="column" justify="center" align="start">
                    <Heading>Dashboard</Heading>
                    <Text color="gray">
                        Overview of dental unit status and operational activity
                    </Text>
                </Flex>
                <Flex align="center" gap="3">
                    <Button color="blue">Report Failure</Button>
                </Flex>
            </Flex>
        </header>


    );
}