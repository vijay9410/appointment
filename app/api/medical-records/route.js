// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// const SECRET = process.env.JWT_SECRET || "supersecretkey";

// // ---------------------------------------------------------
// // GET ALL MEDICAL RECORDS (USER → linked patient)
// // ---------------------------------------------------------
// export async function GET(req) {
//   try {
//     const auth = req.headers.get("authorization");
//     if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

//     const token = auth.split(" ")[1];
//     const decoded = jwt.verify(token, SECRET);


//     const records = await prisma.medicalRecord.findMany({
//       where: { patientId: decoded.patientId },
//       include: {
//         appointment: {
//           select: { id: true, title: true, date: true }
//         },
//         patient: {
//           select: { id: true, name: true, phone: true }
//         },
//         user: {
//           select: { id: true, name: true, role: true }
//         }
//       },
//       orderBy: { createdAt: "desc" }
//     });

//     return Response.json({ records });
//   } catch (err) {
//     console.error("GET Medical Records Error:", err);
//     return Response.json({ error: "Server error" }, { status: 500 });
//   }
// }

// // ---------------------------------------------------------
// // CREATE MEDICAL RECORD (USER / DOCTOR BOTH CAN CREATE)
// // ---------------------------------------------------------
// export async function POST(req) {
//   try {
//     const auth = req.headers.get("authorization");
//     if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

//     const token = auth.split(" ")[1];
//     const decoded = jwt.verify(token, SECRET);

//     const body = await req.json();
//     const { title, type, description, fileUrl, appointmentId } = body;

//     if (!title || !type) {
//       return Response.json(
//         { error: "Title & Type are required" },
//         { status: 400 }
//       );
//     }

//     if (!decoded.patientId) {
//       return Response.json(
//         { error: "patientId missing in token" },
//         { status: 400 }
//       );
//     }

//     const newRecord = await prisma.medicalRecord.create({
//       data: {
//         title,
//         type,
//         description: description || null,
//         fileUrl: fileUrl || null,
//         userId: decoded.id,       // Who created this record (User/Doctor)
//         patientId: decoded.patientId,  // belongs to this patient
//         appointmentId: appointmentId || null,
//       },
//     });

//     return Response.json(
//       { message: "Medical record created", record: newRecord },
//       { status: 201 }
//     );
//   } catch (err) {
//     console.error("POST Medical Record Error:", err);
//     return Response.json({ error: "Server error" }, { status: 500 });
//   }
// }


import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "supersecretkey";

// ---------------------------------------------------------
// GET ALL MEDICAL RECORDS (supports ?patientId=)
// ---------------------------------------------------------
export async function GET(req) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);

    const { searchParams } = new URL(req.url);
    const paramPatientId = searchParams.get("patientId");

    // PRIORITY: Query param first, then token
    const patientId = paramPatientId ? Number(paramPatientId) : decoded.patientId;

    if (!patientId) {
      return Response.json({ error: "patientId missing" }, { status: 400 });
    }

    const records = await prisma.medicalRecord.findMany({
      where: { patientId },
      include: {
        appointment: {
          select: { id: true, title: true, date: true }
        },
        patient: {
          select: { id: true, name: true, phone: true }
        },
        user: {
          select: { id: true, name: true, role: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return Response.json({ records });
  } catch (err) {
    console.error("GET Medical Records Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------
// CREATE MEDICAL RECORD
// ---------------------------------------------------------
export async function POST(req) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);

    const body = await req.json();
    const { title, type, description, fileUrl, appointmentId, patientId } = body;

    if (!title || !type) {
      return Response.json(
        { error: "Title & Type are required" },
        { status: 400 }
      );
    }

    // PRIORITY: If doctor/admin passed patientId manually → allow it
    const finalPatientId = patientId || decoded.patientId;

    if (!finalPatientId) {
      return Response.json(
        { error: "patientId missing (token or body)" },
        { status: 400 }
      );
    }

    const newRecord = await prisma.medicalRecord.create({
      data: {
        title,
        type,
        description: description || null,
        fileUrl: fileUrl || null,
        userId: decoded.id,        // Who created this record
        patientId: finalPatientId, // Actual patient
        appointmentId: appointmentId || null,
      },
    });

    return Response.json(
      { message: "Medical record created", record: newRecord },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST Medical Record Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
