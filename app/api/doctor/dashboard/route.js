//let updated

// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// export async function GET(req) {
//   try {
//     // 1️⃣ Token uthao
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];

//     // 2️⃣ Token decode
//     const decoded = jwt.verify(token, SECRET_KEY);

//     const doctorIdFromToken = decoded.doctorId;   // ✅ FIX
//     const hospitalIdFromToken = decoded.hospitalId;

//     if (!doctorIdFromToken || !hospitalIdFromToken) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }
//     console.log("DECODED TOKEN 👉", decoded);
//     console.log("doctorId 👉", doctorIdFromToken, "hospitalId 👉", hospitalIdFromToken);


//     // 3️⃣ Date range
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999);

//     const allAppointments = await prisma.appointment.findMany({
//           where: {
//             doctorId: doctorIdFromToken,     // ✅ doctor match
//             doctor: {
//               hospitalId: hospitalIdFromToken, // ✅ hospital isolation
//             },
//           },
//           include: {
//             patient: true,
//           },
//           orderBy: {
//             date: "asc",
//           },
//         });


//     // 5️⃣ Categorize
//     const current = allAppointments.filter(
//       (a) => new Date(a.date) >= startOfDay && new Date(a.date) <= endOfDay
//     );
//     const upcoming = allAppointments.filter(
//       (a) => new Date(a.date) > endOfDay
//     );
//     const past = allAppointments.filter(
//       (a) => new Date(a.date) < startOfDay
//     );

//     const summary = {
//       current: current.length,
//       upcoming: upcoming.length,
//       past: past.length,
//       totalPatients: new Set(allAppointments.map((a) => a.patientId)).size,
//     };

//     return NextResponse.json({
//       message: "Welcome Doctor 👋",
//       summary,
//       data: { current, upcoming, past },
//     });
//   } catch (error) {
//     console.error("Doctor dashboard error:", error);
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
// }

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req) {
  try {
    // 1️⃣ Token uthao
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Token decode
    const decoded = jwt.verify(token, SECRET_KEY);

    const doctorIdFromToken = decoded.doctorId;   // ✅ FIX
    const hospitalIdFromToken = decoded.hospitalId;

    if (!doctorIdFromToken || !hospitalIdFromToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    console.log("DECODED TOKEN 👉", decoded);
    console.log("doctorId 👉", doctorIdFromToken, "hospitalId 👉", hospitalIdFromToken);


    // 3️⃣ Date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const allAppointments = await prisma.appointment.findMany({
          where: {
            doctorId: doctorIdFromToken,     // ✅ doctor match
            doctor: {
              hospitalId: hospitalIdFromToken, // ✅ hospital isolation
            },
          },
          include: {
            patient: true,
          },
          orderBy: {
            date: "asc",
          },
        });


    // 5️⃣ Categorize
    const current = allAppointments.filter(
      (a) => new Date(a.date) >= startOfDay && new Date(a.date) <= endOfDay
    );
    const upcoming = allAppointments.filter(
      (a) => new Date(a.date) > endOfDay
    );
    const past = allAppointments.filter(
      (a) => new Date(a.date) < startOfDay
    );

    const summary = {
      current: current.length,
      upcoming: upcoming.length,
      past: past.length,
      totalPatients: new Set(allAppointments.map((a) => a.patientId)).size,
    };

    return NextResponse.json({
      message: "Welcome Doctor 👋",
      summary,
      data: { current, upcoming, past },
    });
  } catch (error) {
    console.error("Doctor dashboard error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
