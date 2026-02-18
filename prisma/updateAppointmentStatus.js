import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function randomStatus() {
  const statuses = ["PENDING", "COMPLETED", "CANCELLED"];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

async function main() {
  const appointments = await prisma.appointment.findMany();

  let completed = 0;
  let cancelled = 0;
  let pending = 0;

  for (const appt of appointments) {
    const status = randomStatus();

    const updateData = {
      status,
    };

    if (status === "COMPLETED") {
      updateData.followUpDate = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000 // +7 days
      );
      completed++;
    } else if (status === "CANCELLED") {
      cancelled++;
    } else {
      pending++;
    }

    await prisma.appointment.update({
      where: { id: appt.id },
      data: updateData,
    });
  }

  console.log("✅ Appointment status updated");
  console.log("COMPLETED:", completed);
  console.log("CANCELLED:", cancelled);
  console.log("PENDING:", pending);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
