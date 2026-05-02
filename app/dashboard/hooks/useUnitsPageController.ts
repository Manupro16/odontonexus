import {useMemo, useState} from "react";
import {mockUnits} from "@/lib/mock/units";
import {DentalUnit, UnitStatus} from "@/lib/types";

export function useUnitsPageController() {
    const [searchQuery, setSearchQuery] = useState("");
    const [areaFilter, setAreaFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<UnitStatus | null>(null);
    const [unitsData] = useState<DentalUnit[]>(mockUnits);

    const filteredUnits = useMemo(() => {
        return unitsData.filter(unit => {
            const matchesSearch = unit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                unit.area.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesArea = areaFilter ? unit.area === areaFilter : true;
            const matchesStatus = statusFilter ? unit.status === statusFilter : true;
            return matchesSearch && matchesArea && matchesStatus;
        });
    }, [unitsData, searchQuery, areaFilter, statusFilter]);

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
        resetFilters
    };
}
