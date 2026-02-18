import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const SECRET = process.env.JWT_SECRET;

export async function GET(req, context) {
  try {
    // 🔥 FIX: params ko await karo
    const { id } = await context.params;

    const auth = req.headers.get("authorization");
    if (!auth) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);

    const recordId = Number(id);
    if (isNaN(recordId)) {
      return Response.json({ error: "Invalid record id" }, { status: 400 });
    }

    const record = await prisma.medicalRecord.findFirst({
      where: {
        id: recordId,
        patient: {
          hospitalId: decoded.hospitalId, // 🔐 hospital security
        },
      },
      include: {
        appointment: true,
        patient: true,
        user: true,
      },
    });

    if (!record) {
      return Response.json({ error: "Record not found" }, { status: 404 });
    }

    return Response.json({ record });
  } catch (error) {
    console.error("GET SINGLE Medical Record Error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
