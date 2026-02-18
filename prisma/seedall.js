import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting: Adding 20 Medical Records...");

  // Fetch all appointments so we can link records safely
  const allAppointments = await prisma.appointment.findMany({
    select: { id: true, patientId: true, userId: true }
  });

  if (allAppointments.length === 0) {
    console.log("❌ No appointments found. Cannot link medical records.");
    return;
  }

  const doctorIds = [2, 3]; // your doctor IDs
  const records = [];

  for (let i = 1; i <= 20; i++) {

    // Select random appointment (REAL linking)
    const randomAppointment =
      allAppointments[Math.floor(Math.random() * allAppointments.length)];

    // Select random patient from 1-30
    const randomPatientId = Math.floor(Math.random() * 30) + 1;

    // Select doctor/user (2 or 3)
    const randomDoctorId = doctorIds[Math.floor(Math.random() * doctorIds.length)];

    const randomType = i % 2 === 0 ? "Lab Report" : "Prescription";

    records.push({
      title: `Medical Record ${i}`,
      type: randomType,
      description: `Auto-generated medical record #${i}`,
      fileUrl: null,

      // Relations
      userId: randomDoctorId,          // your logic: doctorId == userId
      patientId: randomPatientId,
      appointmentId: randomAppointment.id, // REAL APPOINTMENT LINK
      createdAt: new Date(),
    });
  }

  await prisma.medicalRecord.createMany({ data: records });

  console.log("✅ Successfully added 20 Medical Records with real appointment linking!");
}

main()
  .catch((err) => console.error("❌ Error:", err))
  .finally(async () => {
    await prisma.$disconnect();
  });
