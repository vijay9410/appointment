// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function DELETE(req, { params }) {
//   try {
//     // Next.js 15 FIX: params must be awaited
//     const resolved = await params;
//     const id = Number(resolved.id);

//     if (!id) {
//       return NextResponse.json(
//         { message: "Invalid ID" },
//         { status: 400 }
//       );
//     }

//     // Check if doctor exists
//     const doctor = await prisma.user.findUnique({
//       where: { id },
//     });

//     if (!doctor) {
//       return NextResponse.json(
//         { message: "Doctor not found" },
//         { status: 404 }
//       );
//     }

//     // Delete the doctor
//     await prisma.user.delete({
//       where: { id },
//     });

//     return NextResponse.json(
//       { message: "Doctor deleted" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("DELETE ERROR:", error);
//     return NextResponse.json(
//       { message: "Server error" },
//       { status: 500 }
//     );
//   }
// }


// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function PUT(req, { params }) {
//   try {
//     // Next.js 15 FIX: params must be awaited
//     const resolved = await params;
//     const id = Number(resolved.id);

//     if (!id) {
//       return NextResponse.json(
//         { message: "Invalid ID" },
//         { status: 400 }
//       );
//     }

//     const body = await req.json();

//     // Check doctor exists
//     const doctor = await prisma.user.findUnique({
//       where: { id },
//     });

//     if (!doctor) {
//       return NextResponse.json(
//         { message: "Doctor not found" },
//         { status: 404 }
//       );
//     }

//     // Update fields (only update what is provided)
//     const updatedDoctor = await prisma.user.update({
//       where: { id },
//       data: {
//         name: body.name ?? doctor.name,
//         email: body.email ?? doctor.email,
//         phone: body.phone ?? doctor.phone,
//         speciality: body.speciality ?? doctor.speciality,
//         degree: body.degree ?? doctor.degree,
//         experience: body.experience ?? doctor.experience,
//       },
//     });

//     return NextResponse.json(
//       { message: "Doctor updated", doctor: updatedDoctor },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("UPDATE ERROR:", error);
//     return NextResponse.json(
//       { message: "Server error" },
//       { status: 500 }
//     );
//   }
// }


// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// // ---------- GET Doctor by ID ----------
// export async function GET(req, { params }) {
//   try {
//     const resolved = await params;
//     const id = Number(resolved.id);

//     if (!id) {
//       return NextResponse.json(
//         { message: "Invalid ID" },
//         { status: 400 }
//       );
//     }

//     const doctor = await prisma.user.findUnique({
//       where: { id },
//     });

//     if (!doctor) {
//       return NextResponse.json(
//         { message: "Doctor not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(doctor, { status: 200 });
//   } catch (error) {
//     console.error("GET ERROR:", error);
//     return NextResponse.json(
//       { message: "Server error" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ----------- DELETE DOCTOR -------------
export async function DELETE(req, { params }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);

    if (!id) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const doctor = await prisma.user.findUnique({ where: { id } });

    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "Doctor deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


// ----------- UPDATE DOCTOR -------------
// export async function PUT(req, { params }) {
//   try {
//     const resolved = await params;
//     const id = Number(resolved.id);

//     if (!id) {
//       return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
//     }

//     const body = await req.json();

//     const doctor = await prisma.user.findUnique({ where: { id } });

//     if (!doctor) {
//       return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
//     }

//     const updatedDoctor = await prisma.user.update({
//       where: { id },
//       data: {
//         name: body.name ?? doctor.name,
//         email: body.email ?? doctor.email,
//         phone: body.phone ?? doctor.phone,
//         speciality: body.speciality ?? doctor.speciality,
//         degree: body.degree ?? doctor.degree,
//         experience: body.experience ?? doctor.experience,
//       },
//     });

//     return NextResponse.json(
//       { message: "Doctor updated", doctor: updatedDoctor },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("UPDATE ERROR:", error);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }

export async function PUT(req, { params }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);

    if (!id) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    const doctor = await prisma.user.findUnique({ where: { id } });

    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
    }

    const updatedDoctor = await prisma.user.update({
      where: { id },
      data: {
        name: body.name ?? doctor.name,
        email: body.email ?? doctor.email,
        phone: body.phone ?? doctor.phone,
        specialization: body.speciality ?? body.specialization ?? doctor.specialization, // FIXED
        degree: body.degree ?? doctor.degree,
        experience: body.experience ?? doctor.experience,
      },
    });

    return NextResponse.json(
      { message: "Doctor updated", doctor: updatedDoctor },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}



// ----------- GET DOCTOR BY ID -------------
export async function GET(req, { params }) {
  try {
    const resolved = await params;
    const id = Number(resolved.id);

    if (!id) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const doctor = await prisma.user.findUnique({ where: { id } });

    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json(doctor, { status: 200 });
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
