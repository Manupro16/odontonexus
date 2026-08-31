import {Button, Card, Flex, Select, Text} from "@radix-ui/themes";
import {MaintenanceItem} from "@/lib/types";

export interface MaintenanceFilterState {
    area: string;
    unit: string;
    type: "All" | MaintenanceItem["type"];
    status: "All" | MaintenanceItem["status"];
    priority: "All" | MaintenanceItem["priority"];
}

interface MaintenanceFiltersProps {
    items: MaintenanceItem[];
    filters: MaintenanceFilterState;
    onFiltersChange: (next: MaintenanceFilterState) => void;
}

const TYPE_OPTIONS: Array<MaintenanceFilterState["type"]> = ["All", "Preventive", "Corrective", "Installation", "Inspection"];
const STATUS_OPTIONS: Array<MaintenanceFilterState["status"]> = ["All", "Scheduled", "In Progress", "Completed", "Cancelled"];
const PRIORITY_OPTIONS: Array<MaintenanceFilterState["priority"]> = ["All", "Low", "Medium", "High"];

function uniqueSorted(values: string[]) {
    return Array.from(new Set(values)).sort((first, second) => first.localeCompare(second));
}

export function MaintenanceFilters({items, filters, onFiltersChange}: MaintenanceFiltersProps) {
    const areaOptions = uniqueSorted(items.map((item) => item.area));
    const unitOptions = uniqueSorted(items.map((item) => item.unitCode));

    const setFilter = <K extends keyof MaintenanceFilterState>(key: K, value: MaintenanceFilterState[K]) => {
        onFiltersChange({...filters, [key]: value});
    };

    return (
        <Card>
            <Flex direction="column" gap="3">
                <Text size="2" weight="medium">Filters</Text>
                <Flex wrap="wrap" gap="3" align="end">
                    <label>
                        <Text as="div" size="1" color="gray" mb="1">Area</Text>
                        <Select.Root value={filters.area} onValueChange={(value) => setFilter("area", value)}>
                            <Select.Trigger className="w-[170px]"/>
                            <Select.Content>
                                <Select.Item value="All">All</Select.Item>
                                {areaOptions.map((area) => (
                                    <Select.Item key={area} value={area}>{area}</Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </label>

                    <label>
                        <Text as="div" size="1" color="gray" mb="1">Unit</Text>
                        <Select.Root value={filters.unit} onValueChange={(value) => setFilter("unit", value)}>
                            <Select.Trigger className="w-[140px]"/>
                            <Select.Content>
                                <Select.Item value="All">All</Select.Item>
                                {unitOptions.map((unit) => (
                                    <Select.Item key={unit} value={unit}>{unit}</Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </label>

                    <label>
                        <Text as="div" size="1" color="gray" mb="1">Maintenance Type</Text>
                        <Select.Root value={filters.type} onValueChange={(value) => setFilter("type", value as MaintenanceFilterState["type"])}>
                            <Select.Trigger className="w-[180px]"/>
                            <Select.Content>
                                {TYPE_OPTIONS.map((option) => (
                                    <Select.Item key={option} value={option}>{option}</Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </label>

                    <label>
                        <Text as="div" size="1" color="gray" mb="1">Status</Text>
                        <Select.Root value={filters.status} onValueChange={(value) => setFilter("status", value as MaintenanceFilterState["status"])}>
                            <Select.Trigger className="w-[160px]"/>
                            <Select.Content>
                                {STATUS_OPTIONS.map((option) => (
                                    <Select.Item key={option} value={option}>{option}</Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </label>

                    <label>
                        <Text as="div" size="1" color="gray" mb="1">Priority</Text>
                        <Select.Root value={filters.priority} onValueChange={(value) => setFilter("priority", value as MaintenanceFilterState["priority"])}>
                            <Select.Trigger className="w-[140px]"/>
                            <Select.Content>
                                {PRIORITY_OPTIONS.map((option) => (
                                    <Select.Item key={option} value={option}>{option}</Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    </label>

                    <Button
                        variant="soft"
                        color="gray"
                        onClick={() => onFiltersChange({area: "All", unit: "All", type: "All", status: "All", priority: "All"})}
                    >
                        Reset
                    </Button>
                </Flex>
            </Flex>
        </Card>
    );
}
