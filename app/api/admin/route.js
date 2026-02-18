import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req) {
  try {
    // Step 1: Token verify
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return Response.json(
        { error: "Authorization header missing" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return Response.json(
        { error: "Token not provided" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return Response.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Step 2: Only allow Admins
    if (decoded.role !== "ADMIN") {
      return Response.json(
        { error: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    // Step 3: Fetch all appointments
    const allAppointments = await prisma.appointment.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        patient: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { date: "asc" },
    });

    const now = new Date();

    // Step 4: Categorize appointments
    const past = allAppointments.filter((a) => new Date(a.date) < now);
    const current = allAppointments.filter(
      (a) => new Date(a.date).toDateString() === now.toDateString()
    );
    const upcoming = allAppointments.filter((a) => new Date(a.date) > now);

    // 🧮 Count total patients & doctors (based on User.role)
    const totalPatients = await prisma.patient.count({
      //where: { role: "USER" },
    });

    const totalDoctors = await prisma.user.count({
      where: { role: "DOCTOR" },
    });

    // Step 5: Return dashboard data
    return Response.json({
      message: `Welcome Admin ${decoded.email}!`,
      summary: {
        // appointments
        total: allAppointments.length,
        past: past.length,
        current: current.length,
        upcoming: upcoming.length,

        // extra stats
        totalPatients,
        totalDoctors,
      },
      data: {
        current,
        past,
        upcoming,
      },
    });
  } catch (err) {
    console.error("Admin route error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
