import { Flex, Text, Button } from "@radix-ui/themes";

export default function TopBar() {
  return (
    <header className="border-b border-white/10 px-6 py-4">
      <Flex justify="between" align="center">
        <div>
          <Text as="p" weight="bold" size="5" className="text-white">
            Dashboard
          </Text>
          <Text as="p" size="2" className="text-white/60">
            Overview of dental unit status and operational activity
          </Text>
        </div>

        <Button>Report Failure</Button>
      </Flex>
    </header>
  );
}