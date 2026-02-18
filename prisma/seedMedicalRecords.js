import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const appointments = await prisma.appointment.findMany({
    include: {
      doctor: true,
      patient: true,
    },
  });

  let created = 0;

  for (const appt of appointments) {
    // Skip if already record exists
    const existing = await prisma.medicalRecord.findFirst({
      where: { appointmentId: appt.id },
    });

    if (existing) continue;

    await prisma.medicalRecord.create({
      data: {
        title: "Consultation Report",
        type: "Diagnosis",
        description: `Auto report for appointment ${appt.id}`,
        userId: appt.doctorId,      // doctor
        patientId: appt.patientId,
        appointmentId: appt.id,
      },
    });

    created++;
  }

  console.log(`✅ Medical records created: ${created}`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
