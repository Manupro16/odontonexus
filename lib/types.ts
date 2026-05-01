export type ReportStatus = "Open" | "In Progress" | "Closed";
export type ReportPriority = "Low" | "Medium" | "High";

export interface Report {
    id: number;
    unit: string;
    issue: string;
    area: string;
    status: ReportStatus;
    priority: ReportPriority;
    priorityColor: "red" | "orange" | "green" | "blue" | "gray";
}
