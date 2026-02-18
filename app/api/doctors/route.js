// import { NextResponse } from "next/server";


// export async function GET() {
//   try {
//     const doctors = await prisma.user.findMany({
//       where: { role: "DOCTOR" },
//       select: { id: true, name: true, email: true },
//     });

//     return NextResponse.json({ doctors });
//   } catch (error) {
//     console.error("Error fetching doctors:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch doctors" },
//       { status: 500 }
//     );
//   }
// }
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function GET() {
//   try {
//     const doctors = await prisma.user.findMany({
//       where: { role: "DOCTOR" },
//       select: { id: true, name: true, email: true },
//     });

//     return NextResponse.json({ doctors });
//   } catch (error) {
//     console.error("🔥 Prisma error (doctors route):", error); // 👈 Add this line
//     return NextResponse.json(
//       { error: "Failed to fetch doctors" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    // 🔐 AUTH
    const auth = req.headers.get("authorization");
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);

    // 🏥 FETCH DOCTORS (hospital scoped)
    const doctors = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
        hospitalId: decoded.hospitalId, // ✅ IMPORTANT
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ doctors });
  } catch (error) {
    console.error("🔥 Doctors API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
