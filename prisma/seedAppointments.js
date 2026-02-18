import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hospitals = await prisma.hospital.findMany({
    include: {
      users: { where: { role: "DOCTOR" } },
      patients: true,
    },
  });

  let totalCreated = 0;

  for (const hospital of hospitals) {
    const doctors = hospital.users;
    const patients = hospital.patients;

    if (doctors.length === 0 || patients.length === 0) {
      console.log(`⚠️ Skipping ${hospital.name} (no doctors or patients)`);
      continue;
    }

    // Limit demo data
    const maxAppointmentsPerHospital = 10;
    let count = 0;

    for (const doctor of doctors) {
      for (const patient of patients) {
        if (count >= maxAppointmentsPerHospital) break;

        await prisma.appointment.create({
          data: {
            title: `Consultation - ${hospital.name}`,
            date: new Date(Date.now() + count * 86400000), // future dates
            status: "PENDING",
            userId: doctor.id,        // creator
            doctorId: doctor.id,      // assigned doctor
            patientId: patient.id,
            notes: "Auto-generated appointment",
          },
        });

        count++;
        totalCreated++;
      }
      if (count >= maxAppointmentsPerHospital) break;
    }

    console.log(`🏥 ${hospital.name}: ${count} appointments created`);
  }

  console.log(`✅ TOTAL appointments created: ${totalCreated}`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
