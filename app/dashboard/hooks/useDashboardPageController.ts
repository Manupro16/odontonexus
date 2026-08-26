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

    const filteredData = useMemo(() => {
        return initialReports.filter(item => {
            const matchesSearch = item.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.issue.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter ? item.status === statusFilter : true;
            const matchesPriority = priorityFilter ? item.priority === priorityFilter : true;
            const matchesArea = areaFilter ? item.area === areaFilter : true;
            return matchesSearch && matchesStatus && matchesPriority && matchesArea;
        });
    }, [initialReports, searchQuery, statusFilter, priorityFilter, areaFilter]);

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
        filteredData,
        resetFilters
    }
}
