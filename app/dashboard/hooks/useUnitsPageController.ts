import {useMemo, useState} from "react";
import {DentalUnit, UnitStatus} from "@/lib/types";

interface UnitStatusUpdate {
    id: string;
    status: UnitStatus;
}

export function useUnitsPageController(initialUnits: DentalUnit[]) {
    const [searchQuery, setSearchQuery] = useState("");
    const [areaFilter, setAreaFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<UnitStatus | null>(null);
    const [statusDraftByUnitId, setStatusDraftByUnitId] = useState<Record<string, UnitStatus>>({});
    const [optimisticCreatedUnits, setOptimisticCreatedUnits] = useState<DentalUnit[]>([]);

    const canonicalUnits = useMemo(() => {
        const serverUnitIds = new Set(initialUnits.map((unit) => unit.id));
        const optimisticOnlyUnits = optimisticCreatedUnits.filter((unit) => !serverUnitIds.has(unit.id));

        return [...optimisticOnlyUnits, ...initialUnits];
    }, [initialUnits, optimisticCreatedUnits]);

    const canonicalStatusById = useMemo(
        () => new Map(canonicalUnits.map((unit) => [unit.id, unit.status])),
        [canonicalUnits]
    );

    const unitsData = useMemo(
        () => canonicalUnits.map((unit) => {
            const draftStatus = statusDraftByUnitId[unit.id];
            if (!draftStatus || draftStatus === unit.status) {
                return unit;
            }

            return {
                ...unit,
                status: draftStatus
            };
        }),
        [canonicalUnits, statusDraftByUnitId]
    );

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
        return unitsData
            .filter((unit) => canonicalStatusById.get(unit.id) !== unit.status)
            .map((unit) => ({
                id: unit.id,
                status: unit.status
            }));
    }, [unitsData, canonicalStatusById]);

    const hasChanges = pendingStatusUpdates.length > 0;

    const handleUpdateUnitStatus = (id: string, newStatus: UnitStatus) => {
        const canonicalStatus = canonicalStatusById.get(id);
        if (!canonicalStatus) {
            return;
        }

        setStatusDraftByUnitId((prev) => {
            if (newStatus === canonicalStatus) {
                if (!(id in prev)) {
                    return prev;
                }

                const next = {
                    ...prev
                };
                delete next[id];
                return next;
            }

            if (prev[id] === newStatus) {
                return prev;
            }

            return {
                ...prev,
                [id]: newStatus
            };
        });
    };

    const handleCreateUnit = (newUnit: DentalUnit) => {
        setOptimisticCreatedUnits((prev) => [newUnit, ...prev.filter((unit) => unit.id !== newUnit.id)]);
    };

    const handleConfirmChanges = () => {
        setStatusDraftByUnitId((prev) => {
            const next: Record<string, UnitStatus> = {};

            for (const [unitId, status] of Object.entries(prev)) {
                if (canonicalStatusById.get(unitId) !== status) {
                    next[unitId] = status;
                }
            }

            return next;
        });
    };

    const handleResetChanges = () => {
        setStatusDraftByUnitId({});
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
        handleConfirmChanges,
        handleResetChanges,
        resetFilters
    };
}
