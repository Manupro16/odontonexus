import {ReactNode} from "react";

export type ReportStatus = "Open" | "In Progress" | "Closed";
export type ReportPriority = "Low" | "Medium" | "High";

export interface ReportsTableProps {
  filteredData: Report[];
  handleSelectAll: (checked: boolean) => void;
  handleToggleStatus: (id: Report["id"], checked: boolean) => void;
  handleUpdateStatus: (id: Report["id"], newStatus: ReportStatus) => void;
}

export interface Report {
    id: string;
    unit: string;
    issue: string;
    area: string;
    status: ReportStatus;
    priority: ReportPriority;
    priorityColor: "red" | "orange" | "green" | "blue" | "gray";
    createdAt: string;
    closedAt?: string | null;
    reporter: string;
}

export interface ReportUnitOption {
    unitCode: string;
    area: string;
}

export interface MaintenanceRelatedReport {
    id: string;
    issue: string;
    status: "Open" | "In Progress" | "Closed";
}

export interface MaintenanceUnitOption {
    id: string;
    unitCode: string;
    area: string;
}

export interface MaintenanceReportOption {
    id: string;
    unitId: string;
    unitCode: string;
    issue: string;
    status: "Open" | "In Progress" | "Closed";
    priority: "Low" | "Medium" | "High";
}

export interface MaintenanceItem {
    id: string;
    unitId: string;
    unitCode: string;
    area: string;
    type: "Preventive" | "Corrective" | "Installation" | "Inspection";
    status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
    priority: "Low" | "Medium" | "High";
    outcome: "Completed" | "Partial" | "Failed" | null;
    title: string;
    description: string | null;
    scheduledFor: string | null;
    scheduledUntil: string | null;
    performedAt: string | null;
    performedBy: string | null;
    relatedReport: MaintenanceRelatedReport | null;
}

export type UnitStatus = "Operativa" | "Parcialmente Operativa" | "Fuera de Servicio";

export interface DentalUnit {
    id: string; // Unified unique ID (e.g. "U-01")
    number: number;
    area: string;
    status: UnitStatus;
    lastReview: string;
    brand?: string;
    model?: string;
    serialNumber?: string;
    installationDate?: string;
    components: {
        chair: boolean;
        lamp: boolean;
        tripleSyringe: boolean;
        pedal: boolean;
        suction: boolean;
        micromotor: boolean;
        highSpeed: boolean;
    };
    observations?: string;
}


export type DataTableColumn<T> = {
    id: string;
    header: ReactNode;
    cell: (row: T) => ReactNode;
    isRowHeader?: boolean
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string | number;
}

