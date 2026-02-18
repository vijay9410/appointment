import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req) {
  try {
    // ---------------- Token Verification ----------------
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return Response.json(
        { error: "Authorization header missing" },
        { status: 401 }
      );

    const token = authHeader.split(" ")[1];
    if (!token)
      return Response.json(
        { error: "Token not provided" },
        { status: 401 }
      );

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return Response.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // ---------------- Admin Only Access ----------------
    if (decoded.role !== "ADMIN") {
      return Response.json(
        { error: "Access denied — Admins only." },
        { status: 403 }
      );
    }

    // ---------------- Fetch Doctors ----------------
    const doctors = await prisma.user.findMany({
  where: { role: "DOCTOR" },
  select: {
    id: true,
    name: true,
    email: true,
    phone: true,
    specialization: true,
    active: true,     // <-- ADD THIS
    createdAt: true,

  },
  orderBy: { createdAt: "desc" },
});


    return Response.json(doctors);
  } catch (err) {
    console.error("Admin doctors route error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

