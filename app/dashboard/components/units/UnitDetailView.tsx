'use client'

import {
    Badge,
    Box,
    Button,
    Card,
    DataList,
    Dialog,
    Flex,
    Grid,
    Heading,
    Select,
    Separator,
    Strong,
    Text,
    TextArea,
    TextField
} from "@radix-ui/themes";
import {
    ArrowLeftIcon,
    CalendarIcon,
    CheckCircledIcon,
    ExclamationTriangleIcon,
    MinusCircledIcon,
    GearIcon,
    ClockIcon,
    FileTextIcon
} from "@radix-ui/react-icons";
import {DentalUnit, UnitStatus} from "@/lib/types";
import {useRouter} from "next/navigation";
import {type ReactElement, useState, useTransition} from "react";
import {UNIT_STATUSES} from "@/lib/constants";
import {updateUnitMetadata} from "@/app/dashboard/units/actions";

interface UnitDetailViewProps {
    unit: DentalUnit;
    availableAreas: string[];
}

interface UnitEditFormState {
    area: string;
    status: UnitStatus;
    brand: string;
    model: string;
    serialNumber: string;
    installationDate: string;
    observations: string;
}

function toUnitEditForm(unit: DentalUnit): UnitEditFormState {
    return {
        area: unit.area,
        status: unit.status,
        brand: unit.brand ?? "",
        model: unit.model ?? "",
        serialNumber: unit.serialNumber ?? "",
        installationDate: unit.installationDate ?? "",
        observations: unit.observations ?? ""
    };
}

export function UnitDetailView({unit, availableAreas}: UnitDetailViewProps) {
    const router = useRouter();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);
    const [isRefreshing, startRefreshTransition] = useTransition();
    const [editForm, setEditForm] = useState<UnitEditFormState>(() => toUnitEditForm(unit));

    const statusConfig: Record<UnitStatus, { color: "green" | "orange" | "red"; icon: ReactElement }> = {
        "Operativa": { color: "green" as const, icon: <CheckCircledIcon /> },
        "Parcialmente Operativa": { color: "orange" as const, icon: <ExclamationTriangleIcon /> },
        "Fuera de Servicio": { color: "red" as const, icon: <MinusCircledIcon /> }
    };

    const areaOptions = availableAreas.includes(unit.area)
        ? availableAreas
        : [unit.area, ...availableAreas];

    const isEditSubmitDisabled = !editForm.area.trim() || isSavingEdit || isRefreshing;
    const config = statusConfig[unit.status];

    const handleEditDialogOpenChange = (open: boolean) => {
        setIsEditDialogOpen(open);
        setEditError(null);

        if (open) {
            setEditForm(toUnitEditForm(unit));
        }
    };

    const handleSaveEdit = async () => {
        if (isEditSubmitDisabled) {
            return;
        }

        setIsSavingEdit(true);
        setEditError(null);

        const result = await updateUnitMetadata({
            id: unit.id,
            area: editForm.area,
            status: editForm.status,
            brand: editForm.brand,
            model: editForm.model,
            serialNumber: editForm.serialNumber,
            installationDate: editForm.installationDate,
            observations: editForm.observations
        });

        setIsSavingEdit(false);

        if (!result.ok) {
            setEditError(result.error);
            return;
        }

        setIsEditDialogOpen(false);
        startRefreshTransition(() => {
            router.refresh();
        });
    };

    const handleReportFailure = () => {
        const params = new URLSearchParams({
            create: "true",
            unit: unit.id
        });

        router.push(`/dashboard/reports?${params.toString()}`);
    };

    return (
        <Flex direction="column" gap="4">
            {/* Header Actions */}
            <Flex justify="between" align="center">
                <Button variant="ghost" color="gray" onClick={() => router.back()}>
                    <ArrowLeftIcon /> Back to Units
                </Button>
                <Flex gap="3">
                    <Dialog.Root open={isEditDialogOpen} onOpenChange={handleEditDialogOpenChange}>
                        <Dialog.Trigger>
                            <Button variant="soft" color="gray">
                                <GearIcon /> Edit Unit
                            </Button>
                        </Dialog.Trigger>
                        <Dialog.Content maxWidth="560px">
                            <Dialog.Title>Edit Unit {unit.id}</Dialog.Title>
                            <Dialog.Description size="2" mb="4">
                                Update the unit metadata and save the changes.
                            </Dialog.Description>

                            <Flex direction="column" gap="3">
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        Area
                                    </Text>
                                    <Select.Root
                                        value={editForm.area}
                                        onValueChange={(value) => setEditForm((prev) => ({...prev, area: value}))}
                                    >
                                        <Select.Trigger className="w-full" />
                                        <Select.Content>
                                            {areaOptions.map((areaName) => (
                                                <Select.Item key={areaName} value={areaName}>
                                                    {areaName}
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Root>
                                </label>

                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        Status
                                    </Text>
                                    <Select.Root
                                        value={editForm.status}
                                        onValueChange={(value) => setEditForm((prev) => ({...prev, status: value as UnitStatus}))}
                                    >
                                        <Select.Trigger className="w-full" />
                                        <Select.Content>
                                            {UNIT_STATUSES.map((status) => (
                                                <Select.Item key={status} value={status}>
                                                    {status}
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Root>
                                </label>

                                <Grid columns={{initial: "1", sm: "2"}} gap="3">
                                    <label>
                                        <Text as="div" size="2" mb="1" weight="bold">
                                            Brand
                                        </Text>
                                        <TextField.Root
                                            value={editForm.brand}
                                            onChange={(event) => setEditForm((prev) => ({...prev, brand: event.target.value}))}
                                            placeholder="Not specified"
                                        />
                                    </label>
                                    <label>
                                        <Text as="div" size="2" mb="1" weight="bold">
                                            Model
                                        </Text>
                                        <TextField.Root
                                            value={editForm.model}
                                            onChange={(event) => setEditForm((prev) => ({...prev, model: event.target.value}))}
                                            placeholder="Not specified"
                                        />
                                    </label>
                                </Grid>

                                <Grid columns={{initial: "1", sm: "2"}} gap="3">
                                    <label>
                                        <Text as="div" size="2" mb="1" weight="bold">
                                            Serial Number
                                        </Text>
                                        <TextField.Root
                                            value={editForm.serialNumber}
                                            onChange={(event) => setEditForm((prev) => ({...prev, serialNumber: event.target.value}))}
                                            placeholder="N/A"
                                        />
                                    </label>
                                    <label>
                                        <Text as="div" size="2" mb="1" weight="bold">
                                            Installation Date
                                        </Text>
                                        <TextField.Root
                                            type="date"
                                            value={editForm.installationDate}
                                            onChange={(event) => setEditForm((prev) => ({...prev, installationDate: event.target.value}))}
                                        />
                                    </label>
                                </Grid>

                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        Observations
                                    </Text>
                                    <TextArea
                                        rows={4}
                                        value={editForm.observations}
                                        onChange={(event) => setEditForm((prev) => ({...prev, observations: event.target.value}))}
                                        placeholder="No observations recorded"
                                    />
                                </label>
                            </Flex>

                            {editError && (
                                <Text size="2" color="red" mt="3" as="p">
                                    {editError}
                                </Text>
                            )}

                            <Flex gap="3" mt="4" justify="end">
                                <Button
                                    variant="soft"
                                    color="gray"
                                    onClick={() => handleEditDialogOpenChange(false)}
                                    disabled={isSavingEdit || isRefreshing}
                                >
                                    Cancel
                                </Button>
                                <Button color="blue" onClick={handleSaveEdit} disabled={isEditSubmitDisabled}>
                                    {isSavingEdit || isRefreshing ? "Saving..." : "Save Changes"}
                                </Button>
                            </Flex>
                        </Dialog.Content>
                    </Dialog.Root>
                    <Button variant="solid" color="red" onClick={handleReportFailure}>
                        <ExclamationTriangleIcon /> Report Failure
                    </Button>
                </Flex>
            </Flex>

            {/* Main Title & Status */}
            <Card size="3">
                <Flex justify="between" align="center">
                    <Flex direction="column" gap="1">
                        <Text size="2" color="gray">Dental Unit</Text>
                        <Heading size="8">{unit.id}</Heading>
                    </Flex>
                    <Flex direction="column" align="end" gap="2">
                        <Badge color={config.color} variant="soft" size="3">
                            {config.icon} {unit.status}
                        </Badge>
                        <Text size="2" color="gray">
                            Last Review: <Strong>{unit.lastReview}</Strong>
                        </Text>
                    </Flex>
                </Flex>
            </Card>

            <Grid columns={{ initial: "1", md: "3" }} gap="4">
                {/* Left Column: Technical Specifications */}
                <Box className="md:col-span-2">
                    <Flex direction="column" gap="4">
                        <Card size="3">
                            <Heading size="4" mb="4">Technical Specifications</Heading>
                            <DataList.Root orientation={{ initial: "vertical", sm: "horizontal" }}>
                                <DataList.Item>
                                    <DataList.Label color="gray">Area / Clinic</DataList.Label>
                                    <DataList.Value>
                                        <Badge variant="soft" color="blue">{unit.area}</Badge>
                                    </DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label color="gray">Brand</DataList.Label>
                                    <DataList.Value>{unit.brand || "Not specified"}</DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label color="gray">Model</DataList.Label>
                                    <DataList.Value>{unit.model || "Not specified"}</DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label color="gray">Serial Number</DataList.Label>
                                    <DataList.Value>
                                        <Text size="2" className="font-mono">{unit.serialNumber || "N/A"}</Text>
                                    </DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label color="gray">Installation Date</DataList.Label>
                                    <DataList.Value>
                                        <Flex align="center" gap="2">
                                            <CalendarIcon />
                                            {unit.installationDate || "No data"}
                                        </Flex>
                                    </DataList.Value>
                                </DataList.Item>
                            </DataList.Root>
                        </Card>

                        {/* Observations */}
                        <Card size="3">
                            <Heading size="4" mb="3">
                                <Flex align="center" gap="2">
                                    <FileTextIcon /> Observations
                                </Flex>
                            </Heading>
                            {unit.observations ? (
                                <Box className="bg-gray-500/5 p-4 rounded-lg border border-gray-500/10">
                                    <Text size="2" color="gray" as="p">
                                        {unit.observations}
                                    </Text>
                                </Box>
                            ) : (
                                <Text size="2" color="gray">No observations recorded for this unit.</Text>
                            )}
                        </Card>
                    </Flex>
                </Box>

                {/* Right Column: Component Health */}
                <Box>
                    <Card size="3">
                        <Heading size="4" mb="4">Component Health</Heading>
                        <Flex direction="column" gap="3">
                            {Object.entries(unit.components).map(([name, isOk]) => (
                                <Flex key={name} justify="between" align="center" className="bg-gray-500/5 p-3 rounded-lg">
                                    <Text size="2" weight="medium" className="capitalize">
                                        {name.replace(/([A-Z])/g, ' $1').trim()}
                                    </Text>
                                    <Badge color={isOk ? "green" : "red"} variant="surface">
                                        {isOk ? "Functional" : "Faulty"}
                                    </Badge>
                                </Flex>
                            ))}
                        </Flex>
                        <Separator size="4" my="4" />
                        <Button variant="outline" color="gray" className="w-full">
                            Complete Health Check
                        </Button>
                    </Card>
                </Box>
            </Grid>

            {/* Maintenance History Timeline Placeholder */}
            <Card size="3">
                <Flex align="center" gap="2" mb="4">
                    <ClockIcon />
                    <Heading size="4">Maintenance History</Heading>
                </Flex>
                
                <Flex direction="column" gap="4">
                    <Flex gap="4" align="start">
                        <Box className="relative">
                            <Box className="w-3 h-3 rounded-full bg-green-500 mt-1.5" />
                            <Box className="absolute top-6 left-1.5 w-0.5 h-full bg-gray-500/20" />
                        </Box>
                        <Box flexGrow="1">
                            <Flex justify="between" align="center" mb="1">
                                <Text size="2" weight="bold">Preventive Maintenance Completed</Text>
                                <Text size="1" color="gray">2024-04-15</Text>
                            </Flex>
                            <Text size="2" color="gray">General cleaning and lubrication of all moving parts. All systems verified.</Text>
                        </Box>
                    </Flex>

                    <Flex gap="4" align="start">
                        <Box className="relative">
                            <Box className="w-3 h-3 rounded-full bg-orange-500 mt-1.5" />
                            <Box className="absolute top-6 left-1.5 w-0.5 h-full bg-gray-500/20" />
                        </Box>
                        <Box flexGrow="1">
                            <Flex justify="between" align="center" mb="1">
                                <Text size="2" weight="bold">Partial Repair - Lamp</Text>
                                <Text size="1" color="gray">2024-03-20</Text>
                            </Flex>
                            <Text size="2" color="gray">Bulb replacement. Reported flicker still persists occasionally.</Text>
                        </Box>
                    </Flex>

                    <Flex gap="4" align="start">
                        <Box className="relative">
                            <Box className="w-3 h-3 rounded-full bg-blue-500 mt-1.5" />
                        </Box>
                        <Box flexGrow="1">
                            <Flex justify="between" align="center" mb="1">
                                <Text size="2" weight="bold">Unit Installed</Text>
                                <Text size="1" color="gray">2022-01-10</Text>
                            </Flex>
                            <Text size="2" color="gray">Initial installation and calibration by authorized technician.</Text>
                        </Box>
                    </Flex>
                </Flex>
                
                <Box mt="6">
                    <Button variant="ghost" color="gray" size="2">
                        View Full History Log
                    </Button>
                </Box>
            </Card>
        </Flex>
    );
}
