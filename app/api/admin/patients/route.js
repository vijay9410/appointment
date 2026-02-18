// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// export async function GET() {
//   try {
//     const patients = await prisma.patient.findMany({
//       orderBy: { id: "desc" }
//     });

//     return Response.json(patients);
//   } catch (err) {
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(patients);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const patient = await prisma.patient.create({
      data: body,
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
