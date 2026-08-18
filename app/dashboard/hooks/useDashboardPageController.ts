import {useMemo, useState} from "react";
import {Report, ReportPriority, ReportStatus} from "@/lib/types";

interface UseDashboardPageControllerArgs {
    initialReports: Report[];
}

export function useDashboardPageController({initialReports}: UseDashboardPageControllerArgs) {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<ReportStatus | null>(null)
    const [priorityFilter, setPriorityFilter] = useState<ReportPriority | null>(null)
    const [areaFilter, setAreaFilter] = useState<string | null>(null)
    const [tableData, setTableData] = useState<Report[]>(initialReports)
    const [originalData, setOriginalData] = useState<Report[]>(initialReports)

    const hasChanges = useMemo(() => {
        return JSON.stringify(tableData) !== JSON.stringify(originalData);
    }, [tableData, originalData]);

    const handleToggleStatus = (id: Report["id"], checked: boolean) => {
        setTableData(prev => prev.map(item =>
            item.id === id
                ? {...item, status: checked ? "Closed" : "Open"}
                : item
        ))
    }

    const handleUpdateStatus = (id: Report["id"], newStatus: ReportStatus) => {
        setTableData(prev => prev.map(item =>
            item.id === id
                ? {...item, status: newStatus}
                : item
        ))
    }

    const filteredData = useMemo(() => {
        return tableData.filter(item => {
            const matchesSearch = item.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.issue.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter ? item.status === statusFilter : true;
            const matchesPriority = priorityFilter ? item.priority === priorityFilter : true;
            const matchesArea = areaFilter ? item.area === areaFilter : true;
            return matchesSearch && matchesStatus && matchesPriority && matchesArea;
        });
    }, [tableData, searchQuery, statusFilter, priorityFilter, areaFilter]);

    const handleSelectAll = (checked: boolean) => {
        const filteredIds = filteredData.map(item => item.id);
        setTableData(prev => prev.map(item =>
            filteredIds.includes(item.id)
                ? {...item, status: checked ? "Closed" : "Open"}
                : item
        ));
    }

    const handleConfirmChanges = () => {
        setOriginalData(tableData);
    }

    const handleResetChanges = () => {
        setTableData(originalData);
    }

    const resetFilters = () => {
        setSearchQuery("");
        setStatusFilter(null);
        setPriorityFilter(null);
        setAreaFilter(null);
    }

    return {
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        areaFilter,
        setAreaFilter,
        tableData,
        hasChanges,
        filteredData,
        handleToggleStatus,
        handleUpdateStatus,
        handleSelectAll,
        handleConfirmChanges,
        handleResetChanges,
        resetFilters
    }
}
