import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hospitals = [
    { name: "Main Clinic", address: "Head Office" },
    { name: "City Hospital", address: "Delhi" },
    { name: "Care Plus Clinic", address: "Noida" },
    { name: "Health Point", address: "Gurgaon" },
    { name: "Apollo Care", address: "Mumbai" },
  ];

  await prisma.hospital.createMany({
    data: hospitals,
    skipDuplicates: true,
  });

  console.log("✅ Default 5 hospitals created");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
