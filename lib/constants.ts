import {ReportPriority, ReportStatus, UnitStatus} from "./types";

export const AREAS = [
    "Adultos",
    "Endodoncia",
    "Cirugía",
    "Odontopediatría",
    "Ortodoncia",
    "Periodoncia",
] as const;

export const REPORT_STATUSES: ReportStatus[] = ["Open", "In Progress", "Closed"];

export const REPORT_PRIORITIES: ReportPriority[] = ["High", "Medium", "Low"];

export const UNIT_STATUSES: UnitStatus[] = ["Operativa", "Parcialmente Operativa", "Fuera de Servicio"];
