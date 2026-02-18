import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json({ error: "Invalid password" }, { status: 401 });
    }

    // 🔑 JWT payload (IMPORTANT)
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        hospitalId: user.hospitalId ?? null, // 👈 KEY LINE
         doctorId: user.role === "DOCTOR" ? user.id : null
      },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    // 🔒 Password remove
    const { password: _, ...safeUser } = user;

    return Response.json(
      {
        message: "Login successful",
        token,
        user: safeUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
