import {useEffect, useMemo, useState} from "react";
import {DentalUnit, UnitStatus} from "@/lib/types";

interface UnitStatusUpdate {
    id: string;
    status: UnitStatus;
}

export function useUnitsPageController(initialUnits: DentalUnit[]) {
    const [searchQuery, setSearchQuery] = useState("");
    const [areaFilter, setAreaFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<UnitStatus | null>(null);
    const [unitsData, setUnitsData] = useState<DentalUnit[]>(initialUnits);
    const [originalUnitsData, setOriginalUnitsData] = useState<DentalUnit[]>(initialUnits);

    useEffect(() => {
        setUnitsData(initialUnits);
        setOriginalUnitsData(initialUnits);
    }, [initialUnits]);

    const hasChanges = useMemo(() => {
        return JSON.stringify(unitsData) !== JSON.stringify(originalUnitsData);
    }, [unitsData, originalUnitsData]);

    const filteredUnits = useMemo(() => {
        return unitsData.filter(unit => {
            const matchesSearch = unit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                unit.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                unit.number.toString().includes(searchQuery) ||
                (unit.observations?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
            const matchesArea = areaFilter ? unit.area === areaFilter : true;
            const matchesStatus = statusFilter ? unit.status === statusFilter : true;
            return matchesSearch && matchesArea && matchesStatus;
        });
    }, [unitsData, searchQuery, areaFilter, statusFilter]);

    const pendingStatusUpdates = useMemo<UnitStatusUpdate[]>(() => {
        const originalStatusById = new Map(originalUnitsData.map((unit) => [unit.id, unit.status]));

        return unitsData
            .filter((unit) => originalStatusById.get(unit.id) !== unit.status)
            .map((unit) => ({
                id: unit.id,
                status: unit.status
            }));
    }, [unitsData, originalUnitsData]);

    const handleUpdateUnitStatus = (id: string, newStatus: UnitStatus) => {
        setUnitsData(prev => prev.map(unit => 
            unit.id === id ? { ...unit, status: newStatus } : unit
        ));
    };

    const handleCreateUnit = (newUnit: DentalUnit) => {
        setUnitsData(prev => [newUnit, ...prev]);
    };

    const handleConfirmChanges = () => {
        setOriginalUnitsData(unitsData);
    };

    const handleApplyPersistedUpdates = (updatedUnits: DentalUnit[]) => {
        if (updatedUnits.length === 0) {
            return;
        }

        const updatedUnitsById = new Map(updatedUnits.map((unit) => [unit.id, unit]));

        setUnitsData((prev) => prev.map((unit) => updatedUnitsById.get(unit.id) ?? unit));
        setOriginalUnitsData((prev) => prev.map((unit) => updatedUnitsById.get(unit.id) ?? unit));
    };

    const handleResetChanges = () => {
        setUnitsData(originalUnitsData);
    };

    const resetFilters = () => {
        setSearchQuery("");
        setAreaFilter(null);
        setStatusFilter(null);
    };

    return {
        searchQuery,
        setSearchQuery,
        areaFilter,
        setAreaFilter,
        statusFilter,
        setStatusFilter,
        filteredUnits,
        unitsData,
        pendingStatusUpdates,
        hasChanges,
        handleUpdateUnitStatus,
        handleCreateUnit,
        handleApplyPersistedUpdates,
        handleConfirmChanges,
        handleResetChanges,
        resetFilters
    };
}
