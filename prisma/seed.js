import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const PASSWORD =
  "$2b$10$38V3uBPPmr.TFSpTBZFBOe1mneqdf3moSO28BkOK/NhD2l0eTCdee";

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  console.log("🌱 Seeding FULL medical data...");

  // 2 hospitals
  for (let h = 1; h <= 2; h++) {
    // 🏥 Hospital
    const hospital = await prisma.hospital.create({
      data: { name: `Hospital ${h}` },
    });

    // 👨‍💼 Admin
    await prisma.user.create({
      data: {
        name: `Admin ${h}`,
        email: `admin${h}@test.com`,
        password: PASSWORD,
        role: "ADMIN",
        hospitalId: hospital.id,
      },
    });

    // 👤 Counter Users
    const users = [];
    for (let u = 1; u <= 2; u++) {
      users.push(
        await prisma.user.create({
          data: {
            name: `User${h}_${u}`,
            email: `user${h}_${u}@test.com`,
            password: PASSWORD,
            role: "USER",
            hospitalId: hospital.id,
          },
        })
      );
    }

    // 🧑‍⚕️ Doctor
    const doctor = await prisma.user.create({
      data: {
        name: `Doctor ${h}`,
        email: `doctor${h}@test.com`,
        password: PASSWORD,
        role: "DOCTOR",
        specialization: "Physician",
        hospitalId: hospital.id,
      },
    });

    // 🧑 Patients
    for (let p = 1; p <= 5; p++) {
      const patient = await prisma.patient.create({
        data: {
          name: `Patient${h}_${p}`,
          email: `patient${h}_${p}@test.com`,
          age: 25 + p,
          gender: p % 2 === 0 ? "Female" : "Male",
          hospitalId: hospital.id,
        },
      });

      // 📅 Dates
      const pastDates = [daysFromNow(-10), daysFromNow(-5)];
      const todayDates = [new Date(), new Date()];
      const futureDates = [daysFromNow(5), daysFromNow(10)];

      const allDates = [...pastDates, ...todayDates, ...futureDates];

      for (let i = 0; i < allDates.length; i++) {
        const isPast = allDates[i] < new Date();

        // 📌 Appointment
        const appointment = await prisma.appointment.create({
          data: {
            title: `Checkup ${i + 1}`,
            date: allDates[i],
            status: isPast ? "COMPLETED" : "PENDING",

            hospitalId: hospital.id, // 🔥 REQUIRED CHANGE

            userId: users[p % 2].id, // counter user
            doctorId: doctor.id,
            patientId: patient.id,
          },
        });

        // 📝 Appointment Note (ONLY for past)
        if (isPast) {
          await prisma.appointmentNote.create({
            data: {
              appointmentId: appointment.id,
              doctorId: doctor.id,
              diagnosis: "Viral Fever",
              prescription: "Paracetamol 500mg",
              tests: "CBC",
              followUpDate: daysFromNow(7),
            },
          });

          // 📂 Medical Record – Prescription
          await prisma.medicalRecord.create({
            data: {
              title: "Prescription",
              type: "Prescription",
              description: "Fever medication prescribed",
              userId: appointment.userId,
              patientId: patient.id,
              appointmentId: appointment.id,
            },
          });

          // 📂 Medical Record – Lab Report
          await prisma.medicalRecord.create({
            data: {
              title: "Blood Test Report",
              type: "Lab Report",
              description: "CBC normal",
              userId: appointment.userId,
              patientId: patient.id,
              appointmentId: appointment.id,
            },
          });
        }
      }
    }
  }

  console.log("✅ FULL medical seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
