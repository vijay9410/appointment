import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;

    const today = new Date();

    const followUps = await prisma.appointment.findMany({
      where: {
        userId,
        followUpDate: { not: null, gte: today }
      },
      orderBy: { followUpDate: "asc" },
      include: {
        doctor: { select: { name: true } },
        patient: { select: { name: true } }
      }
    });

    return NextResponse.json({ followUps });
  } catch (err) {
    console.error("Follow-up API error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
