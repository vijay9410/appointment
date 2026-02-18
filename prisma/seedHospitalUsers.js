import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hospitals = await prisma.hospital.findMany();

  for (const hospital of hospitals) {
    const users = [];

    for (let i = 1; i <= 5; i++) {
      users.push({
        name: `User ${hospital.id}-${i}`,
        email: `user_${hospital.id}_${i}@hospital.com`,
        password: "$2b$10$38V3uBPPmr.TFSpTBZFBOe1mneqdf3moSO28BkOK/NhD2l0eTCdee",
        role: "USER",
        hospitalId: hospital.id,
      });
    }

    await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    });
  }

  console.log("✅ 5 users created for each hospital");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
