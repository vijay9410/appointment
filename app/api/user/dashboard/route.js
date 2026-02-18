// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// export async function GET(req) {
//   try {
//     // Step 1: Token Validation
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader) {
//       return Response.json({ error: "Authorization header missing" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       return Response.json({ error: "Token not provided" }, { status: 401 });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, SECRET_KEY);
//     } catch (err) {
//       return Response.json({ error: "Invalid or expired token" }, { status: 401 });
//     }

//     // Step 2: Role check
//     if (decoded.role !== "USER") {
//       return Response.json({ error: "Access denied. Users only." }, { status: 403 });
//     }

//     // Step 3: Fetch user’s own appointments
//     const myAppointments = await prisma.appointment.findMany({
//       where: { userId: decoded.id },
//       include: {
//         patient: { select: { id: true, name: true, email: true, phone: true } },
//       },
//       orderBy: { date: "asc" },
//     });

//     // Step 4: Categorize appointments
//     const now = new Date();

//     const past = myAppointments.filter((a) => new Date(a.date) < now);
//     const current = myAppointments.filter(
//       (a) => new Date(a.date).toDateString() === now.toDateString()
//     );
//     const upcoming = myAppointments.filter((a) => new Date(a.date) > now);

//     // Step 5: Send Response
//     return Response.json({
//       message: `Welcome ${decoded.email}!`,
//       summary: {
//         total: myAppointments.length,
//         past: past.length,
//         current: current.length,
//         upcoming: upcoming.length,
//       },
//       data: {
//         past,
//         current,
//         upcoming,
//       },
//     });
//   } catch (err) {
//     console.error("User dashboard error:", err);
//     return Response.json({ error: "Server error" }, { status: 500 });
//   }
// }
// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// export async function GET(req) {
//   try {
//     // Step 1: Token Validation
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader) {
//       return Response.json({ error: "Authorization header missing" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       return Response.json({ error: "Token not provided" }, { status: 401 });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, SECRET_KEY);
//     } catch (err) {
//       return Response.json({ error: "Invalid or expired token" }, { status: 401 });
//     }

//     // Step 2: Role check
//     if (decoded.role !== "USER") {
//       return Response.json({ error: "Access denied. Users only." }, { status: 403 });
//     }

//     // Step 3: Fetch user appointments
//     const myAppointments = await prisma.appointment.findMany({
//       where: { userId: decoded.id },
//       include: {
//         patient: { select: { id: true, name: true, email: true, phone: true } },
//       },
//       orderBy: { date: "asc" },
//     });

//     const now = new Date();

//     const past = myAppointments.filter((a) => new Date(a.date) < now);
//     const current = myAppointments.filter(
//       (a) => new Date(a.date).toDateString() === now.toDateString()
//     );
//     const upcoming = myAppointments.filter((a) => new Date(a.date) > now);

//     // ---------------------------------------------------------
//     // 🆕 NEW SECTION 1: Follow-up Reminders
//     // ---------------------------------------------------------
//     const followUps = myAppointments.filter(
//       (a) => a.followUpDate && new Date(a.followUpDate) > now
//     );

//     // ---------------------------------------------------------
//     // 🆕 NEW SECTION 2: Medical Records
//     // (Empty array for now — until you add schema/model)
//     // ---------------------------------------------------------
//     const medicalRecords = []; // placeholder for UI

//     // Step 4: Response
//     return Response.json({
//       message: `Welcome ${decoded.email}!`,
//       summary: {
//         total: myAppointments.length,
//         past: past.length,
//         current: current.length,
//         upcoming: upcoming.length,
//       },
//       data: {
//         past,
//         current,
//         upcoming,
//         followUps,       // 🆕 Added
//         medicalRecords,  // 🆕 Added
//       },
//     });

//   } catch (err) {
//     console.error("User dashboard error:", err);
//     return Response.json({ error: "Server error" }, { status: 500 });
//   }
// }


// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// export async function GET(req) {
//   try {
//     // ---------------- Token Validation ----------------
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader) {
//       return Response.json({ error: "Authorization header missing" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       return Response.json({ error: "Token not provided" }, { status: 401 });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, SECRET_KEY);
//     } catch (err) {
//       return Response.json({ error: "Invalid or expired token" }, { status: 401 });
//     }

//     if (decoded.role !== "USER") {
//       return Response.json({ error: "Access denied. Users only." }, { status: 403 });
//     }

//     // ---------------- Fetch User Appointments ----------------
//     const appointments = await prisma.appointment.findMany({
//       where: { userId: decoded.id },
//       include: {
//         patient: { select: { id: true, name: true } },
//         doctor: { select: { id: true, name: true } },
//       },
//       orderBy: { date: "asc" },
//     });

//     const now = new Date();

//     const past = appointments.filter((a) => new Date(a.date) < now);
//     const current = appointments.filter(
//       (a) => new Date(a.date).toDateString() === now.toDateString()
//     );
//     const upcoming = appointments.filter((a) => new Date(a.date) > now);

//     // ---------------- Follow-up Reminders ----------------
//     const followUps = await prisma.appointment.findMany({
//       where: {
//         userId: decoded.id,
//         followUpDate: { not: null },
//       },
//       include: {
//         patient: { select: { id: true, name: true } },
//       },
//       orderBy: { followUpDate: "asc" },
//     });

//     // ---------------- Medical Records ----------------
//     const medicalRecords = await prisma.medicalRecord.findMany({
//       where: { userId: decoded.id },
//       include: {
//         patient: { select: { name: true } },
//         appointment: { select: { title: true, date: true } },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     // ---------------- Response ----------------
//     return Response.json({
//       message: `Welcome ${decoded.email}!`,
//       summary: {
//         total: appointments.length,
//         past: past.length,
//         current: current.length,
//         upcoming: upcoming.length,
//         followUps: followUps.length,
//         medicalRecords: medicalRecords.length,
//       },
//       data: {
//         past,
//         current,
//         upcoming,
//         followUps,
//         medicalRecords,
//       },
//     });
//   } catch (err) {
//     console.error("User dashboard error:", err);
//     return Response.json({ error: "Server error" }, { status: 500 });
//   }
// }


// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// export async function GET(req) {
//   try {
//     // ---------------- Token Validation ----------------
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader) {
//       return Response.json({ error: "Authorization header missing" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       return Response.json({ error: "Token not provided" }, { status: 401 });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, SECRET_KEY);
//     } catch {
//       return Response.json({ error: "Invalid or expired token" }, { status: 401 });
//     }

//     if (decoded.role !== "USER") {
//       return Response.json({ error: "Access denied. Users only." }, { status: 403 });
//     }

//     // ---------------- Fetch Logged-in User ----------------
//     const user = await prisma.user.findUnique({
//       where: { id: decoded.id },
//       select: {
//         id: true,
//         email: true,
//         hospitalId: true,
//       },
//     });

//     if (!user || !user.hospitalId) {
//       return Response.json(
//         { error: "User not assigned to any hospital" },
//         { status: 403 }
//       );
//     }

//     // ---------------- Fetch User Appointments (Hospital-wise) ----------------
//     const appointments = await prisma.appointment.findMany({
//       where: {
//         userId: user.id,
//         patient: {
//           hospitalId: user.hospitalId,
//         },
//       },
//       include: {
//         patient: { select: { id: true, name: true } },
//         doctor: { select: { id: true, name: true } },
//       },
//       orderBy: { date: "asc" },
//     });

//     const now = new Date();

//     const past = appointments.filter(a => new Date(a.date) < now);
//     const current = appointments.filter(
//       a => new Date(a.date).toDateString() === now.toDateString()
//     );
//     const upcoming = appointments.filter(a => new Date(a.date) > now);

//     // ---------------- Follow-up Reminders (Hospital-wise) ----------------
//     const followUps = await prisma.appointment.findMany({
//       where: {
//         userId: user.id,
//         followUpDate: { not: null },
//         patient: {
//           hospitalId: user.hospitalId,
//         },
//       },
//       include: {
//         patient: { select: { id: true, name: true } },
//       },
//       orderBy: { followUpDate: "asc" },
//     });

//     // ---------------- Medical Records (Hospital-wise) ----------------
//     const medicalRecords = await prisma.medicalRecord.findMany({
//       where: {
//         userId: user.id,
//         patient: {
//           hospitalId: user.hospitalId,
//         },
//       },
//       include: {
//         patient: { select: { name: true } },
//         appointment: { select: { title: true, date: true } },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     // ---------------- Response ----------------
//     return Response.json({
//       message: `Welcome ${user.email}!`,
//       hospitalId: user.hospitalId,
//       summary: {
//         total: appointments.length,
//         past: past.length,
//         current: current.length,
//         upcoming: upcoming.length,
//         followUps: followUps.length,
//         medicalRecords: medicalRecords.length,
//       },
//       data: {
//         past,
//         current,
//         upcoming,
//         followUps,
//         medicalRecords,
//       },
//     });
//   } catch (err) {
//     console.error("User dashboard error:", err);
//     return Response.json({ error: "Server error" }, { status: 500 });
//   }
// }

import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req) {
  try {
    console.log("==== USER DASHBOARD API HIT ====");

    // ---------------- Token Validation ----------------
    const authHeader = req.headers.get("authorization");
    console.log("Auth Header:", authHeader);

    if (!authHeader) {
      console.log("❌ Authorization header missing");
      return Response.json({ error: "Authorization header missing" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token ? "PRESENT" : "MISSING");

    if (!token) {
      return Response.json({ error: "Token not provided" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
      console.log("✅ Decoded Token:", decoded);
    } catch (err) {
      console.log("❌ Token verification failed:", err.message);
      return Response.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    if (decoded.role !== "USER") {
      console.log("❌ Role mismatch:", decoded.role);
      return Response.json({ error: "Access denied. Users only." }, { status: 403 });
    }

    // ---------------- Fetch Logged-in User ----------------
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        hospitalId: true,
      },
    });

    console.log("👤 User from DB:", user);

    if (!user || !user.hospitalId) {
      console.log("❌ User has no hospital assigned");
      return Response.json(
        { error: "User not assigned to any hospital" },
        { status: 403 }
      );
    }

    // // ---------------- Fetch User Appointments ----------------
    // const appointments = await prisma.appointment.findMany({
    //   where: {
    //    // userId: user.id,
    //     patient: {
    //       hospitalId: user.hospitalId,
    //     },
    //   },
    //   include: {
    //     patient: { select: { id: true, name: true } },
    //     doctor: { select: { id: true, name: true } },
    //   },
    //   orderBy: { date: "asc" },
    // });

    // console.log("📅 Total Appointments Found:", appointments.length);
    // console.log("📅 Appointments Raw Data:", appointments);

    // const now = new Date();
    // console.log("🕒 Server Time:", now);

    // const past = appointments.filter(a => new Date(a.date) < now);
    // const current = appointments.filter(
    //   a => new Date(a.date).toDateString() === now.toDateString()
    // );
    // const upcoming = appointments.filter(a => new Date(a.date) > now);

    // console.log("📊 Past:", past.length);
    // console.log("📊 Current:", current.length);
    // console.log("📊 Upcoming:", upcoming.length);

    // ---------------- Fetch User Appointments ----------------
    const appointments = await prisma.appointment.findMany({
      where: {
        // userId: user.id,
        hospitalId: user.hospitalId, // ✅ hospital based
      },
      include: {
        patient: { select: { id: true, name: true } },
        doctor: { select: { id: true, name: true } },
      },
      orderBy: { date: "asc" },
    });

    console.log("📅 Total Appointments Found:", appointments.length);
    console.log("📅 Appointments Raw Data:", appointments);

    // 🕒 Normalize today (IMPORTANT)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log("🕒 Server Date (normalized):", today);

    // ---------------- Exclusive Buckets ----------------
    const past = [];
    const current = [];
    const upcoming = [];

    appointments.forEach(a => {
      const d = new Date(a.date);
      d.setHours(0, 0, 0, 0);

      if (d < today) {
        past.push(a);
      } else if (d.getTime() === today.getTime()) {
        current.push(a);
      } else {
        upcoming.push(a);
      }
    });

    console.log("📊 Past:", past.length);
    console.log("📊 Current:", current.length);
    console.log("📊 Upcoming:", upcoming.length);

    // ---------------- Follow-up Reminders ----------------
    const followUps = await prisma.appointment.findMany({
      where: {
        userId: user.id,
        followUpDate: { not: null },
        patient: {
          hospitalId: user.hospitalId,
        },
      },
      include: {
        patient: { select: { id: true, name: true } },
      },
      orderBy: { followUpDate: "asc" },
    });

    console.log("⏰ Follow-ups Found:", followUps.length);

    // ---------------- Medical Records ----------------
    const medicalRecords = await prisma.medicalRecord.findMany({
      where: {
        userId: user.id,
        patient: {
          hospitalId: user.hospitalId,
        },
      },
      include: {
        patient: { select: { name: true } },
        appointment: { select: { title: true, date: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("📂 Medical Records Found:", medicalRecords.length);

    console.log("==== USER DASHBOARD API END ====");

    // ---------------- Response ----------------
    return Response.json({
      message: `Welcome ${user.email}!`,
      hospitalId: user.hospitalId,
      summary: {
        total: appointments.length,
        past: past.length,
        current: current.length,
        upcoming: upcoming.length,
        followUps: followUps.length,
        medicalRecords: medicalRecords.length,
      },
      data: {
        past,
        current,
        upcoming,
        followUps,
        medicalRecords,
      },
    });
  } catch (err) {
    console.error("🔥 User dashboard error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
