import {useMemo, useState} from "react";
import {mockUnits} from "@/lib/mock/units";
import {DentalUnit, UnitStatus} from "@/lib/types";

export function useUnitsPageController() {
    const [searchQuery, setSearchQuery] = useState("");
    const [areaFilter, setAreaFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<UnitStatus | null>(null);
    const [unitsData, setUnitsData] = useState<DentalUnit[]>(mockUnits);
    const [originalUnitsData, setOriginalUnitsData] = useState<DentalUnit[]>(mockUnits);

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
        hasChanges,
        handleUpdateUnitStatus,
        handleCreateUnit,
        handleConfirmChanges,
        handleResetChanges,
        resetFilters
    };
}
