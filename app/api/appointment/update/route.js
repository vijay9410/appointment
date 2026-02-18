// // import { NextResponse } from "next/server";
// // import prisma from "@/lib/prisma";

// // export async function PUT(req) {
// //   try {
// //     const body = await req.json();
// //     const { appointmentId, diagnosis, prescription, tests, followUpDate } = body;

// //     if (!appointmentId) {
// //       return NextResponse.json({ error: "Appointment ID required" }, { status: 400 });
// //     }

// //     const updated = await prisma.appointment.update({
// //       where: { id: parseInt(appointmentId) },
// //       data: {
// //         diagnosis,
// //         prescription,
// //         tests,
// //         followUpDate: followUpDate ? new Date(followUpDate) : null,
// //       },
// //       include: {
// //         patient: true,
// //       },
// //     });

// //     return NextResponse.json({
// //       success: true,
// //       message: "Appointment updated successfully",
// //       data: updated,
// //     });
// //   } catch (error) {
// //     console.error("Error updating appointment:", error);
// //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// //   }
// // }

// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function PUT(req) {
//   try {
//     const body = await req.json();
//     const { appointmentId, diagnosis, prescription, tests, followUpDate } = body;

//     // 🩺 (optional) If doctor is logged in and has ID in localStorage, pass it
//     const doctorId = body.doctorId ? Number(body.doctorId) : 1; // fallback

//     // ✅ Create a new note instead of overwriting appointment
//     const newNote = await prisma.appointmentNote.create({
//       data: {
//         appointmentId: Number(appointmentId),
//         doctorId,
//         diagnosis,
//         prescription,
//         tests,
//         followUpDate: followUpDate ? new Date(followUpDate) : null,
//       },
//     });

//     // Optional: update Appointment follow-up for dashboard summary
//     await prisma.appointment.update({
//       where: { id: Number(appointmentId) },
//       data: { followUpDate: followUpDate ? new Date(followUpDate) : null },
//     });

//     return NextResponse.json({
//       message: "New doctor note added successfully",
//       note: newNote,
//     });
//   } catch (error) {
//     console.error("💥 Error saving doctor note:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function PUT(req) {
//   try {
//     const body = await req.json();
//     const { appointmentId, diagnosis, prescription, tests, followUpDate } = body;

//     // Get doctorId (if token or localStorage not used, hardcode for now)
//     const doctorId = body.doctorId ? Number(body.doctorId) : 1;

//     // ✅ Create a new doctor note entry
//     const newNote = await prisma.appointmentNote.create({
//       data: {
//         appointmentId: Number(appointmentId),
//         doctorId,
//         diagnosis,
//         prescription,
//         tests,
//         followUpDate: followUpDate ? new Date(followUpDate) : null,
//       },
//     });

//     // Optionally update main appointment followUpDate
//     await prisma.appointment.update({
//       where: { id: Number(appointmentId) },
//       data: { followUpDate: followUpDate ? new Date(followUpDate) : null },
//     });

//     return NextResponse.json({
//       message: "New doctor note added successfully!",
//       note: newNote,
//     });
//   } catch (error) {
//     console.error("💥 Error saving doctor note:", error);
//     return NextResponse.json(
//       { error: error.message || "Server error" },
//       { status: 500 }
//     );
//   }
// }



//leyterdterds


// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function PUT(req) {
//   try {
//     const body = await req.json();
//     const { appointmentId, diagnosis, prescription, tests, followUpDate } = body;

//     if (!appointmentId) {
//       return NextResponse.json(
//         { error: "Appointment ID is required" },
//         { status: 400 }
//       );
//     }

//     // ✅ Step 1: Fetch appointment to get the correct doctorId
//     const appointment = await prisma.appointment.findUnique({
//       where: { id: Number(appointmentId) },
//     });

//     if (!appointment) {
//       return NextResponse.json(
//         { error: "Appointment not found" },
//         { status: 404 }
//       );
//     }

//     // ✅ Step 2: Use appointment.userId as doctorId (since both are same)
//     const doctorId = appointment.userId;

//     // ✅ Step 3: Create a new doctor note entry
//     const newNote = await prisma.appointmentNote.create({
//       data: {
//         appointmentId: Number(appointmentId),
//         doctorId,
//         diagnosis: diagnosis || null,
//         prescription: prescription || null,
//         tests: tests || null,
//         followUpDate: followUpDate ? new Date(followUpDate) : null,
//       },
//     });

//     // ✅ Step 4: Optionally update followUpDate in main appointment
//     await prisma.appointment.update({
//       where: { id: Number(appointmentId) },
//       data: {
//         followUpDate: followUpDate ? new Date(followUpDate) : null,
//       },
//     });

//     return NextResponse.json({
//       message: "New doctor note added successfully!",
//       note: newNote,
//     });
//   } catch (error) {
//     console.error("💥 Error saving doctor note:", error);
//     return NextResponse.json(
//       { error: error.message || "Server error" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🔴 FORCE NODE RUNTIME (important)
export const runtime = "nodejs";

export async function PUT(req) {
  console.log("🔥🔥🔥 PUT /api/appointment/update HIT 🔥🔥🔥");

  try {
    console.log("➡️ Step 1: Parsing request body");
    const body = await req.json();
    console.log("📦 Request Body:", body);

    const { appointmentId, diagnosis, prescription, tests, followUpDate } = body;

    console.log("➡️ Step 2: Extracted values");
    console.log({
      appointmentId,
      diagnosis,
      prescription,
      tests,
      followUpDate,
    });

    if (!appointmentId) {
      console.log("❌ appointmentId missing");
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    console.log("➡️ Step 3: Fetching appointment from DB");
    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(appointmentId) },
    });

    console.log("📄 Appointment found:", appointment);

    if (!appointment) {
      console.log("❌ Appointment NOT FOUND");
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    const doctorId = appointment.doctorId;
    console.log("👨‍⚕️ Doctor ID resolved:", doctorId);

    console.log("➡️ Step 4: Creating appointment note");
    const newNote = await prisma.appointmentNote.create({
      data: {
        appointmentId: Number(appointmentId),
        doctorId,
        diagnosis: diagnosis || null,
        prescription: prescription || null,
        tests: tests || null,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
      },
    });

    console.log("📝 New Note Created:", newNote);

    console.log("➡️ Step 5: Updating followUpDate in appointment");
    const updatedAppointment = await prisma.appointment.update({
      where: { id: Number(appointmentId) },
      data: {
        followUpDate: followUpDate ? new Date(followUpDate) : null,
      },
    });

    console.log("📅 Appointment updated:", updatedAppointment);

    console.log("✅ API COMPLETED SUCCESSFULLY");

    return NextResponse.json({
      success: true,
      message: "New doctor note added successfully!",
      note: newNote,
    });
  } catch (error) {
    console.error("💥 API ERROR OCCURRED 💥");
    console.error(error);

    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
