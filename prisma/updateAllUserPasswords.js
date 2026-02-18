import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const HASHED_PASSWORD =
  "$2b$10$38V3uBPPmr.TFSpTBZFBOe1mneqdf3moSO28BkOK/NhD2l0eTCdee";

async function main() {
  const result = await prisma.user.updateMany({
    data: {
      password: HASHED_PASSWORD,
    },
  });

  console.log(`✅ Password updated for ${result.count} users`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
