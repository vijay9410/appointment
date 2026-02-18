// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     // 🧩 Get and verify token
//     const token = req.headers.get("authorization")?.split(" ")[1];
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.id; // logged-in user ID

//     // 🧾 Parse request body
//     const { title, doctorId, patientId, date, notes } = await req.json();

//     // ✅ Validate fields
//     if (!title || !patientId || !date) {
//       return NextResponse.json(
//         { error: "Missing required fields (title, patient, date, time)" },
//         { status: 400 }
//       );
//     }

//     // 🧠 Optional: doctorId can be null (if not assigned yet)
//     const appointment = await prisma.appointment.create({
//       data: {
//         title,
//         userId,
//         doctorId: doctorId ? parseInt(doctorId) : null,
//         patientId: parseInt(patientId),
//         date: new Date(`${date}`),
//         notes,
//       },
//       include: {
//         doctor: { select: { id: true, name: true } },
//         patient: { select: { id: true, name: true, phone: true } },
//         user: { select: { id: true, name: true } },
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Appointment created successfully!",
//       appointment,
//     });
//   } catch (error) {
//     console.error("Error creating appointment:", error);

//     if (error.name === "JsonWebTokenError") {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }

//     return NextResponse.json(
//       { error: "Failed to create appointment" },
//       { status: 500 }
//     );
//   }
// }


// import jwt from "jsonwebtoken";
// import prisma from "@/lib/prisma";

// const SECRET = process.env.JWT_SECRET;

// export async function POST(req) {
//   try {
//     // 🔐 AUTH
//     const auth = req.headers.get("authorization");
//     if (!auth) {
//       return Response.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const token = auth.split(" ")[1];
//     const decoded = jwt.verify(token, SECRET);

//     // 📦 BODY (NO patientId, NO hospitalId)
//     const body = await req.json();
//     const { title, doctorId, date, notes } = body;

//     if (!doctorId || !date) {
//       return Response.json(
//         { error: "doctorId and date are required" },
//         { status: 400 }
//       );
//     }

//     // 🔍 STEP 1: Find patient linked with logged-in user
//     const userPatient = await prisma.userPatient.findFirst({
//       where: {
//         userId: decoded.id,
//       },
//       include: {
//         patient: true,
//       },
//     });

//     if (!userPatient) {
//       return Response.json(
//         { error: "No patient linked with this user" },
//         { status: 400 }
//       );
//     }

//     // 🏥 OPTIONAL SAFETY (same hospital check)
//     if (userPatient.patient.hospitalId !== decoded.hospitalId) {
//       return Response.json(
//         { error: "Patient does not belong to your hospital" },
//         { status: 403 }
//       );
//     }

//     // 🗓️ STEP 2: Create appointment
//     const appointment = await prisma.appointment.create({
//       data: {
//         title: title || "Consultation",
//         date: new Date(date),
//         doctorId: Number(doctorId),
//         patientId: userPatient.patientId,
//         hospitalId: decoded.hospitalId,
//         notes: notes || null,
//         createdById: decoded.id, // optional (audit)
//       },
//     });

//     return Response.json(
//       {
//         message: "Appointment booked successfully",
//         appointment,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("BOOK APPOINTMENT ERROR:", error);
//     return Response.json({ error: "Server error" }, { status: 500 });
//   }
// }


import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    // 🔐 AUTH
    const auth = req.headers.get("authorization");
    if (!auth) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);

    // 📦 BODY
    const body = await req.json();
    const { title, doctorId, date, notes } = body;

    if (!doctorId || !date) {
      return Response.json(
        { error: "doctorId and date are required" },
        { status: 400 }
      );
    }

    // 🔍 STEP 1: Find PATIENT using user email + hospital
    const patient = await prisma.patient.findFirst({
      where: {
        email: decoded.email,          // 👈 user ↔ patient link
        hospitalId: decoded.hospitalId // 👈 same hospital
      }
    });

    if (!patient) {
      return Response.json(
        { error: "Patient profile not found for this user" },
        { status: 400 }
      );
    }

    // 🗓️ STEP 2: Create appointment (schema-safe)
    const appointment = await prisma.appointment.create({
      data: {
        title: title || "Consultation",
        date: new Date(date),
        notes: notes || null,
        hospitalId: decoded.hospitalId, 
        userId: decoded.id,          // 👈 who booked
        doctorId: Number(doctorId),  // 👨‍⚕️ doctor
        patientId: patient.id        // 🧑‍⚕️ patient
      },
    });

    return Response.json(
      {
        message: "Appointment booked successfully",
        appointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("BOOK APPOINTMENT ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
