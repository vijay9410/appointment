
// // import { NextResponse } from "next/server";
// // import prisma from "@/lib/prisma";

// // export async function GET(req, context) {
// //   try {
// //     // ✅ Correct: Await the `params` promise directly (Next.js 15+)
// //     const params = await context.params;
// //     console.log("🧩 DEBUG PARAMS:", params);

// //     const appointmentId = parseInt(params.id, 10);
// //     if (!appointmentId || isNaN(appointmentId)) {
// //       console.log("❌ Invalid appointmentId:", appointmentId);
// //       return NextResponse.json(
// //         { error: "Invalid appointment ID" },
// //         { status: 400 }
// //       );
// //     }

// //     const appointment = await prisma.appointment.findUnique({
// //       where: { id: appointmentId },
// //       include: {
// //         patient: true,
// //         doctor: true,
// //         user: true,
// //         doctorNotes: {
// //           include: { doctor: true },
// //           orderBy: { createdAt: "desc" },
// //         },
// //       },
// //     });

// //     if (!appointment) {
// //       return NextResponse.json(
// //         { error: "Appointment not found" },
// //         { status: 404 }
// //       );
// //     }

// //     return NextResponse.json(appointment);
// //   } catch (error) {
// //     console.error("💥 Error fetching appointment:", error);
// //     return NextResponse.json(
// //       { error: error.message || "Server error" },
// //       { status: 500 }
// //     );
// //   }
// // }

// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET(req, { params }) {
//   try {
//     const id = Number(params.id);

//     const appointment = await prisma.appointment.findUnique({
//       where: { id },
//       include: {
//         doctor: true,
//         patient: true,
//       },
//     });

//     if (!appointment)
//       return NextResponse.json({ error: "Not found" }, { status: 404 });

//     return NextResponse.json(appointment);
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function PATCH(req, { params }) {
//   try {
//     const id = Number(params.id);
//     const data = await req.json();

//     const updated = await prisma.appointment.update({
//       where: { id },
//       data,
//     });

//     return NextResponse.json(updated);
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function DELETE(req, { params }) {
//   try {
//     const id = Number(params.id);

//     await prisma.appointment.delete({
//       where: { id },
//     });

//     return NextResponse.json({ message: "Appointment deleted" });
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------- GET ----------
export async function GET(req, context) {
  try {
    const { id } = await context.params;   // ✔ Correct
    const numericId = Number(id);

    const appointment = await prisma.appointment.findUnique({
      where: { id: numericId },
      include: {
        doctor: true,
        patient: true,
         doctorNotes: {
          orderBy: { createdAt: "desc" }, // latest first
        },
      },
    });

    if (!appointment)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(appointment);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ---------- PATCH ----------
export async function PATCH(req, context) {
  try {
    const { id } = await context.params;   // ✔ Correct
    const numericId = Number(id);

    const data = await req.json();

    const updated = await prisma.appointment.update({
      where: { id: numericId },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ---------- DELETE ----------
export async function DELETE(req, context) {
  try {
    const { id } = await context.params;   // ✔ Correct
    const numericId = Number(id);

    await prisma.appointment.delete({
      where: { id: numericId },
    });

    return NextResponse.json({ message: "Appointment deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

