import { Report } from "../types";

export const mockTableData: Report[] = [
    {
        id: 1,
        unit: "U-12",
        issue: "Lamp failure",
        area: "Adultos",
        status: "Open",
        priority: "Medium",
        priorityColor: "orange" as const,
        createdAt: "2024-05-01",
        reporter: "Dr. Arrieta"
    },
    {
        id: 2,
        unit: "U-03",
        issue: "Pedal issue",
        area: "Endodoncia",
        status: "In Progress",
        priority: "High",
        priorityColor: "red" as const,
        createdAt: "2024-05-02",
        reporter: "Dra. Gomez"
    },
    {
        id: 3,
        unit: "U-08",
        issue: "Micromotor not working",
        area: "Cirugía",
        status: "Open",
        priority: "Low",
        priorityColor: "green" as const,
        createdAt: "2024-05-03",
        reporter: "Dr. Martinez"
    },
    {
        id: 4,
        unit: "U-15",
        issue: "Water leak",
        area: "Odontopediatría",
        status: "Closed",
        priority: "Medium",
        priorityColor: "orange" as const,
        createdAt: "2024-04-28",
        reporter: "Dra. Suarez"
    },
    {
        id: 5,
        unit: "U-22",
        issue: "Suction power low",
        area: "Adultos",
        status: "Open",
        priority: "High",
        priorityColor: "red" as const,
        createdAt: "2024-05-04",
        reporter: "Dr. Arrieta"
    },
];