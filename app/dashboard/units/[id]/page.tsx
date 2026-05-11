

import {mockUnits} from "@/lib/mock/units";
import {UnitDetailView} from "../../components/UnitDetailView";
import {Button, Flex, Text} from "@radix-ui/themes";
import Link from "next/link";
import {ArrowLeftIcon} from "@radix-ui/react-icons";


interface UnitDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function UnitDetailPage({params}: UnitDetailPageProps) {
    const { id } = await params;
    const unit = mockUnits.find(u => u.id === id);

    if (!unit) {
        return (
            <Flex direction="column" align="center" justify="center" py="9" gap="4">
                <Text size="5" weight="bold">Unit Not Found</Text>
                <Text color="gray">The dental unit with ID &#34;{id}&#34; could not be located in our system.</Text>
                <Button asChild variant="soft" color="gray">
                    <Link href="/dashboard/units">
                        <ArrowLeftIcon /> Back to Units
                    </Link>
                </Button>
            </Flex>
        );
    }

    return <UnitDetailView unit={unit} />;
}
