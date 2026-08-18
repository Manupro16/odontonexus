import {useMemo, useState} from "react";
import {Report, ReportPriority, ReportStatus} from "@/lib/types";

interface UseReportsPageControllerArgs {
    initialReports: Report[];
}

export function useReportsPageController({initialReports}: UseReportsPageControllerArgs) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<ReportStatus | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<ReportPriority | null>(null);
    const [areaFilter, setAreaFilter] = useState<string | null>(null);
    const [tableData, setTableData] = useState<Report[]>(initialReports);
    const [originalData, setOriginalData] = useState<Report[]>(initialReports);

    const hasChanges = useMemo(() => {
        return JSON.stringify(tableData) !== JSON.stringify(originalData);
    }, [tableData, originalData]);

    const filteredData = useMemo(() => {
        return tableData.filter(item => {
            const matchesSearch = item.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.reporter.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter ? item.status === statusFilter : true;
            const matchesPriority = priorityFilter ? item.priority === priorityFilter : true;
            const matchesArea = areaFilter ? item.area === areaFilter : true;
            return matchesSearch && matchesStatus && matchesPriority && matchesArea;
        });
    }, [tableData, searchQuery, statusFilter, priorityFilter, areaFilter]);

    const stats = useMemo(() => {
        const total = tableData.length;
        const open = tableData.filter(r => r.status === "Open").length;
        const highPriority = tableData.filter(r => r.priority === "High" && r.status !== "Closed").length;
        const resolvedThisMonth = tableData.filter(r => r.status === "Closed").length; // Mock logic

        return {
            total,
            open,
            highPriority,
            resolvedThisMonth
        };
    }, [tableData]);

    const handleUpdateStatus = (id: Report["id"], newStatus: ReportStatus) => {
        setTableData(prev => prev.map(item =>
            item.id === id ? {...item, status: newStatus} : item
        ));
    };

    const handleToggleStatus = (id: Report["id"], checked: boolean) => {
        handleUpdateStatus(id, checked ? "Closed" : "Open");
    };

    const handleSelectAll = (checked: boolean) => {
        setTableData(prev => prev.map(item => ({
            ...item,
            status: checked ? "Closed" : "Open"
        })));
    };

    const handleCreateReport = (newReport: Report) => {
        setTableData(prev => [newReport, ...prev]);
    };

    const handleConfirmChanges = () => {
        setOriginalData(tableData);
    };

    const handleResetChanges = () => {
        setTableData(originalData);
    };

    const resetFilters = () => {
        setSearchQuery("");
        setStatusFilter(null);
        setPriorityFilter(null);
        setAreaFilter(null);
    };

    return {
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        areaFilter,
        setAreaFilter,
        hasChanges,
        tableData,
        filteredData,
        stats,
        handleToggleStatus,
        handleUpdateStatus,
        handleSelectAll,
        handleCreateReport,
        handleConfirmChanges,
        handleResetChanges,
        resetFilters
    };
}
