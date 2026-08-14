import { PrismaClient } from "../generated/prisma/client.ts";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set.");
}

const prisma = new PrismaClient({
  accelerateUrl: databaseUrl,
});

const areaMappings = {
  Adultos: {
    code: "ADULTS",
    displayName: "Adultos",
  },
  Endodoncia: {
    code: "ENDODONTICS",
    displayName: "Endodoncia",
  },
  "Cirugía": {
    code: "SURGERY",
    displayName: "Cirugía",
  },
  "Odontopediatría": {
    code: "PEDIATRIC_DENTISTRY",
    displayName: "Odontopediatría",
  },
  Ortodoncia: {
    code: "ORTHODONTICS",
    displayName: "Ortodoncia",
  },
  Periodoncia: {
    code: "PERIODONTICS",
    displayName: "Periodoncia",
  },
};

const unitStatusMappings = {
  Operativa: "OPERATIONAL",
  "Parcialmente Operativa": "PARTIALLY_OPERATIONAL",
  "Fuera de Servicio": "OUT_OF_SERVICE",
};

const reportStatusMappings = {
  Open: "OPEN",
  "In Progress": "IN_PROGRESS",
  Closed: "CLOSED",
};

const reportPriorityMappings = {
  Low: "LOW",
  Medium: "MEDIUM",
  High: "HIGH",
};

const areasFromFrontend = [
  "Adultos",
  "Endodoncia",
  "Cirugía",
  "Odontopediatría",
  "Ortodoncia",
  "Periodoncia",
];

const unitsFromFrontend = [
  {
    unitCode: "U-01",
    area: "Adultos",
    status: "Operativa",
    lastReview: "2024-04-15",
    brand: "KaVo",
    model: "Estetica E50",
    serialNumber: "KV-882910",
    installationDate: "2022-01-10",
  },
  {
    unitCode: "U-02",
    area: "Adultos",
    status: "Parcialmente Operativa",
    lastReview: "2024-03-20",
    brand: "KaVo",
    model: "Estetica E50",
    serialNumber: "KV-882911",
    installationDate: "2022-01-12",
    observations: "Lámpara con parpadeo constante.",
  },
  {
    unitCode: "U-03",
    area: "Endodoncia",
    status: "Fuera de Servicio",
    lastReview: "2024-01-10",
    brand: "Sirona",
    model: "Intego",
    serialNumber: "SR-110223",
    installationDate: "2021-05-15",
    observations: "Falla general en sistema de aire y piezas de mano.",
  },
  {
    unitCode: "U-04",
    area: "Odontopediatría",
    status: "Operativa",
    lastReview: "2024-04-25",
    brand: "A-dec",
    model: "300",
    serialNumber: "AD-99201",
    installationDate: "2023-03-01",
  },
  {
    unitCode: "U-05",
    area: "Cirugía",
    status: "Operativa",
    lastReview: "2024-04-10",
    brand: "Gnatus",
    model: "S500 Air",
    serialNumber: "GN-55210",
    installationDate: "2020-11-20",
  },
  {
    unitCode: "U-06",
    area: "Adultos",
    status: "Operativa",
    lastReview: "2024-04-01",
    brand: "KaVo",
    model: "Estetica E50",
    serialNumber: "KV-882912",
    installationDate: "2022-01-15",
  },
];

const reportsFromFrontend = [
  {
    legacyNumericId: 1,
    unitCode: "U-02",
    issueDescription: "Lamp failure",
    area: "Adultos",
    status: "Open",
    priority: "Medium",
    createdAt: "2024-05-01",
    reporterName: "Dr. Arrieta",
  },
  {
    legacyNumericId: 2,
    unitCode: "U-03",
    issueDescription: "Pedal issue",
    area: "Endodoncia",
    status: "In Progress",
    priority: "High",
    createdAt: "2024-05-02",
    reporterName: "Dra. Gomez",
  },
  {
    legacyNumericId: 3,
    unitCode: "U-05",
    issueDescription: "Micromotor not working",
    area: "Cirugía",
    status: "Open",
    priority: "Low",
    createdAt: "2024-05-03",
    reporterName: "Dr. Martinez",
  },
  {
    legacyNumericId: 4,
    unitCode: "U-04",
    issueDescription: "Water leak",
    area: "Odontopediatría",
    status: "Closed",
    priority: "Medium",
    createdAt: "2024-04-28",
    reporterName: "Dra. Suarez",
  },
  {
    legacyNumericId: 5,
    unitCode: "U-01",
    issueDescription: "Suction power low",
    area: "Adultos",
    status: "Open",
    priority: "High",
    createdAt: "2024-05-04",
    reporterName: "Dr. Arrieta",
  },
];

function toDate(value) {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

function getAreaMapping(label) {
  const mapping = areaMappings[label];

  if (!mapping) {
    throw new Error(`Unsupported area label in seed data: ${label}`);
  }

  return mapping;
}

async function seedAreas() {
  for (const areaLabel of areasFromFrontend) {
    const area = getAreaMapping(areaLabel);

    await prisma.area.upsert({
      where: { code: area.code },
      create: {
        code: area.code,
        displayName: area.displayName,
        isActive: true,
      },
      update: {
        displayName: area.displayName,
        isActive: true,
      },
    });
  }
}

async function seedUnits() {
  for (const unit of unitsFromFrontend) {
    const area = getAreaMapping(unit.area);
    const persistedArea = await prisma.area.findUniqueOrThrow({
      where: { code: area.code },
      select: { id: true },
    });

    const mappedStatus = unitStatusMappings[unit.status];

    if (!mappedStatus) {
      throw new Error(`Unsupported unit status in seed data: ${unit.status}`);
    }

    await prisma.unit.upsert({
      where: { unitCode: unit.unitCode },
      create: {
        unitCode: unit.unitCode,
        areaId: persistedArea.id,
        status: mappedStatus,
        lastReviewAt: toDate(unit.lastReview),
        brand: unit.brand ?? null,
        model: unit.model ?? null,
        serialNumber: unit.serialNumber ?? null,
        installationDate: toDate(unit.installationDate),
        observations: unit.observations ?? null,
      },
      update: {
        areaId: persistedArea.id,
        status: mappedStatus,
        lastReviewAt: toDate(unit.lastReview),
        brand: unit.brand ?? null,
        model: unit.model ?? null,
        serialNumber: unit.serialNumber ?? null,
        installationDate: toDate(unit.installationDate),
        observations: unit.observations ?? null,
      },
    });
  }
}

async function seedReports() {
  let skippedReports = 0;

  for (const report of reportsFromFrontend) {
    const mappedStatus = reportStatusMappings[report.status];
    const mappedPriority = reportPriorityMappings[report.priority];

    if (!mappedStatus) {
      throw new Error(`Unsupported report status in seed data: ${report.status}`);
    }

    if (!mappedPriority) {
      throw new Error(`Unsupported report priority in seed data: ${report.priority}`);
    }

    const unit = await prisma.unit.findUnique({
      where: { unitCode: report.unitCode },
      select: { id: true },
    });

    if (!unit) {
      skippedReports += 1;
      continue;
    }

    await prisma.report.upsert({
      where: { legacyNumericId: report.legacyNumericId },
      create: {
        legacyNumericId: report.legacyNumericId,
        unitId: unit.id,
        issueDescription: report.issueDescription,
        status: mappedStatus,
        priority: mappedPriority,
        reporterName: report.reporterName,
        createdAt: toDate(report.createdAt) ?? undefined,
        closedAt: mappedStatus === "CLOSED" ? toDate(report.createdAt) : null,
      },
      update: {
        unitId: unit.id,
        issueDescription: report.issueDescription,
        status: mappedStatus,
        priority: mappedPriority,
        reporterName: report.reporterName,
        closedAt: mappedStatus === "CLOSED" ? toDate(report.createdAt) : null,
      },
    });
  }

  return skippedReports;
}

async function main() {
  await seedAreas();
  await seedUnits();
  const skippedReports = await seedReports();

  console.log(
    `Seed completed. Areas source: ${areasFromFrontend.length}, units source: ${unitsFromFrontend.length}, reports source: ${reportsFromFrontend.length}, reports skipped (missing unit reference): ${skippedReports}.`,
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });