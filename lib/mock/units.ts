import { DentalUnit } from "../types";

export const mockUnits: DentalUnit[] = [
    {
        id: "U-01",
        number: 1,
        area: "Adultos",
        status: "Operativa",
        lastMaintenance: "2024-04-15",
        components: {
            chair: true,
            lamp: true,
            tripleSyringe: true,
            pedal: true,
            suction: true,
            micromotor: true,
            highSpeed: true
        }
    },
    {
        id: "U-02",
        number: 2,
        area: "Adultos",
        status: "Parcialmente Operativa",
        lastMaintenance: "2024-03-20",
        components: {
            chair: true,
            lamp: false,
            tripleSyringe: true,
            pedal: true,
            suction: true,
            micromotor: true,
            highSpeed: true
        },
        observations: "Lámpara con parpadeo constante."
    },
    {
        id: "U-03",
        number: 3,
        area: "Endodoncia",
        status: "Fuera de Servicio",
        lastMaintenance: "2024-01-10",
        components: {
            chair: true,
            lamp: true,
            tripleSyringe: false,
            pedal: false,
            suction: true,
            micromotor: false,
            highSpeed: false
        },
        observations: "Falla general en sistema de aire y piezas de mano."
    },
    {
        id: "U-04",
        number: 4,
        area: "Odontopediatría",
        status: "Operativa",
        lastMaintenance: "2024-04-25",
        components: {
            chair: true,
            lamp: true,
            tripleSyringe: true,
            pedal: true,
            suction: true,
            micromotor: true,
            highSpeed: true
        }
    },
    {
        id: "U-05",
        number: 5,
        area: "Cirugía",
        status: "Operativa",
        lastMaintenance: "2024-04-10",
        components: {
            chair: true,
            lamp: true,
            tripleSyringe: true,
            pedal: true,
            suction: true,
            micromotor: true,
            highSpeed: true
        }
    },
    {
        id: "U-06",
        number: 6,
        area: "Adultos",
        status: "Operativa",
        lastMaintenance: "2024-04-01",
        components: {
            chair: true,
            lamp: true,
            tripleSyringe: true,
            pedal: true,
            suction: true,
            micromotor: true,
            highSpeed: true
        }
    }
];
