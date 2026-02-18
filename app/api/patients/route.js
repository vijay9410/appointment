// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import prisma from "@/lib/prisma";

// export async function GET(req) {
//   try {
//     const token = req.headers.get("authorization")?.split(" ")[1];
//     if (!token)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     jwt.verify(token, process.env.JWT_SECRET);

//     const patients = await prisma.patient.findMany({
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({ patients });
//   } catch (error) {
//     console.error("Error fetching patients:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch patients" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔐 Only token-based hospital access
    const hospitalId = decoded.hospitalId;

    if (!hospitalId) {
      return NextResponse.json(
        { error: "Hospital not assigned to user" },
        { status: 403 }
      );
    }

    const patients = await prisma.patient.findMany({
      where: {
        hospitalId: hospitalId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}
