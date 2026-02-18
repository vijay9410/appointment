import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const MIN_PATIENTS = 10;

  const hospitals = await prisma.hospital.findMany({
    include: { patients: true },
  });

  for (const hospital of hospitals) {
    const currentCount = hospital.patients.length;
    const need = MIN_PATIENTS - currentCount;

    if (need > 0) {
      const newPatients = Array.from({ length: need }).map((_, i) => ({
        name: `Patient ${hospital.id}-${i + 1}`,
        phone: `99999${hospital.id}${i}`,
        hospitalId: hospital.id,
      }));

      await prisma.patient.createMany({
        data: newPatients,
      });

      console.log(
        `🏥 ${hospital.name}: ${need} new patients created`
      );
    }
  }

  console.log("✅ All hospitals now have minimum patients");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
