import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // <-- Make sure this path is correct in your project

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: "appointmentId and status are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.appointment.update({
      where: { id: Number(appointmentId) },
      data: { status },
    });

    return NextResponse.json(
      { message: "Status updated", data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
