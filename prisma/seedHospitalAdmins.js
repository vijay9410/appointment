import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hospitals = await prisma.hospital.findMany();

  for (const hospital of hospitals) {
    await prisma.user.create({
      data: {
        name: `${hospital.name} Admin`,
        email: `admin_${hospital.id}@hospital.com`,
        password: "admin123", // demo password
        role: "ADMIN",
        hospitalId: hospital.id,
      },
    });
  }

  console.log("✅ One admin created for each hospital");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
