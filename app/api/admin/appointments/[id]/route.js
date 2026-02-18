// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

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

export async function PATCH(req, { params }) {
  try {
    // FIX → unwrap params (Next.js 15 requirement)
    const resolved = await params;
    const id = Number(resolved.id);

    const data = await req.json();

    const updated = await prisma.appointment.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    // FIX → unwrap params
    const resolved = await params;
    const id = Number(resolved.id);

    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Appointment deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
