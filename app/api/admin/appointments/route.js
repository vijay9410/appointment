import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { id: "desc" },
      include: {
        doctor: true,
        patient: true,
      }
    });

    return NextResponse.json(appointments);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();

    const appointment = await prisma.appointment.create({
      data,
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
