import { DentalUnit } from "../types";

export const mockUnits: DentalUnit[] = [
    {
        id: "U-01",
        number: 1,
        area: "Adultos",
        status: "Operativa",
        lastReview: "2024-04-15",
        brand: "KaVo",
        model: "Estetica E50",
        serialNumber: "KV-882910",
        installationDate: "2022-01-10",
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
        lastReview: "2024-03-20",
        brand: "KaVo",
        model: "Estetica E50",
        serialNumber: "KV-882911",
        installationDate: "2022-01-12",
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
        lastReview: "2024-01-10",
        brand: "Sirona",
        model: "Intego",
        serialNumber: "SR-110223",
        installationDate: "2021-05-15",
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
        lastReview: "2024-04-25",
        brand: "A-dec",
        model: "300",
        serialNumber: "AD-99201",
        installationDate: "2023-03-01",
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
        lastReview: "2024-04-10",
        brand: "Gnatus",
        model: "S500 Air",
        serialNumber: "GN-55210",
        installationDate: "2020-11-20",
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
        lastReview: "2024-04-01",
        brand: "KaVo",
        model: "Estetica E50",
        serialNumber: "KV-882912",
        installationDate: "2022-01-15",
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
