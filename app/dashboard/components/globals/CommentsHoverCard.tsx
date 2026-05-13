import {Avatar, Box, Flex, Heading, ScrollArea, Text} from "@radix-ui/themes";
import {mockComments} from "@/lib/mock/comments";

export function CommentsHoverCard() {
    return (
        <ScrollArea type="always" scrollbars="vertical" style={{height: 200}}>
            <Box pr="4">
                <Heading size="3" mb="3">Unit Comments</Heading>
                <Flex direction="column" gap="4">
                    {mockComments.map((comment) => (
                        <Flex key={comment.id} gap="3" align="start">
                            <Avatar
                                size="2"
                                fallback={comment.user[0]}
                                radius="full"
                                variant="soft"
                                color="blue"
                            />
                            <Box flexGrow="1">
                                <Flex justify="between" align="center" gap="4"
                                      mb="1">
                                    <Text size="2"
                                          weight="bold">{comment.user}</Text>
                                    <Text size="1"
                                          color="gray">{comment.time}</Text>
                                </Flex>
                                <Text as="p" size="2" color="gray" highContrast>
                                    {comment.text}
                                </Text>
                            </Box>
                        </Flex>
                    ))}
                </Flex>
            </Box>
        </ScrollArea>
    );
}
