
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// ---------- GET Patient ----------
export async function GET(req, { params }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);

    if (!id) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({ where: { id } });

    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient, { status: 200 });
  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}



// ---------- UPDATE Patient ----------
// export async function PUT(req, { params }) {
//   try {
//     const resolved = await params;
//     const id = Number(resolved.id);
//     const body = await req.json();

//     const updatedPatient = await prisma.patient.update({
//       where: { id },
//       data: {
//         name: body.name ?? undefined,
//         email: body.email ?? undefined,
//         phone: body.phone ?? undefined,
//         gender: body.gender ?? undefined,

//         // Uncomment only if "age" exists in Prisma schema:
//         // age: body.age ? Number(body.age) : undefined,
//       },
//     });

//     return NextResponse.json(
//       { message: "Patient updated", patient: updatedPatient },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("UPDATE ERROR:", err);
//     return NextResponse.json(
//       { message: "Update failed", error: err.message },
//       { status: 500 }
//     );
//   }
// }

export async function PUT(req, { params }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);
    const body = await req.json();

    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        email: body.email ?? undefined,
        phone: body.phone ?? undefined,
        gender: body.gender ?? undefined,
        age: body.age !== "" ? Number(body.age) : null, // 👈 FINAL FIX
      },
    });

    return NextResponse.json(
      { message: "Patient updated", patient: updatedPatient },
      { status: 200 }
    );
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return NextResponse.json(
      { message: "Update failed", error: err.message },
      { status: 500 }
    );
  }
}




// ---------- DELETE Patient ----------
export async function DELETE(req, { params }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);

    await prisma.patient.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Patient deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json(
      { message: "Delete failed", error: err.message },
      { status: 500 }
    );
  }
}
