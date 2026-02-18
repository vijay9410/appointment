import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hospitals = await prisma.hospital.findMany({
    orderBy: { id: "asc" },
  });

  const doctors = await prisma.user.findMany({
    where: { role: "DOCTOR" },
  });

  if (hospitals.length === 0) {
    throw new Error("No hospitals found");
  }

  let index = 0;

  for (const doctor of doctors) {
    const hospital = hospitals[index % hospitals.length];

    await prisma.user.update({
      where: { id: doctor.id },
      data: { hospitalId: hospital.id },
    });

    index++;
  }

  console.log("✅ Existing doctors distributed across hospitals");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
