import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const MIN_DOCTORS = 3;

  const hospitals = await prisma.hospital.findMany({
    include: {
      users: {
        where: { role: "DOCTOR" },
      },
    },
  });

  for (const hospital of hospitals) {
    const currentCount = hospital.users.length;
    const need = MIN_DOCTORS - currentCount;

    if (need > 0) {
      const newDoctors = Array.from({ length: need }).map((_, i) => ({
        name: `Dr ${hospital.id}-${i + 1}`,
        email: `dr${hospital.id}_${i + 1}@hospital.com`,
        password: "password123",
        role: "DOCTOR",
        specialization: "General Physician",
        hospitalId: hospital.id,
      }));

      await prisma.user.createMany({
        data: newDoctors,
        skipDuplicates: true,
      });

      console.log(
        `🏥 ${hospital.name}: ${need} new doctors created`
      );
    }
  }

  console.log("✅ All hospitals now have minimum doctors");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
