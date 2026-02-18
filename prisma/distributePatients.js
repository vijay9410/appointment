import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hospitals = await prisma.hospital.findMany({
    orderBy: { id: "asc" },
  });

  const patients = await prisma.patient.findMany();

  if (hospitals.length === 0) {
    throw new Error("No hospitals found");
  }

  let index = 0;

  for (const patient of patients) {
    const hospital = hospitals[index % hospitals.length];

    await prisma.patient.update({
      where: { id: patient.id },
      data: { hospitalId: hospital.id },
    });

    index++;
  }

  console.log("✅ Existing patients distributed across hospitals");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
