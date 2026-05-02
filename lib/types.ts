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
