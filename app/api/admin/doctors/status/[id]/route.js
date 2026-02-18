// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// export async function PATCH(req, context) {
//   try {
//     // 1️⃣ Params (NO AWAIT NEEDED)
//     const id = Number(context.params.id);

//     // 2️⃣ Token Validation
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader) {
//       return Response.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];

//     let decoded;
//     try {
//       decoded = jwt.verify(token, SECRET_KEY);
//     } catch {
//       return Response.json({ error: "Invalid token" }, { status: 401 });
//     }

//     if (decoded.role !== "ADMIN") {
//       return Response.json({ error: "Forbidden" }, { status: 403 });
//     }

//     // 3️⃣ Safe Body Parse
//     let body = {};
//     try {
//       body = await req.json();
//     } catch (e) {}

//     const { active } = body;

//     if (typeof active !== "boolean") {
//       return Response.json({ error: "Invalid active value" }, { status: 400 });
//     }

//     // 4️⃣ Update Doctor
//     const updated = await prisma.user.update({
//       where: { id },
//       data: { active },
//     });

//     return Response.json({
//       success: true,
//       active: updated.active,
//     });

//   } catch (err) {
//     console.error("PATCH ERROR:", err);
//     return Response.json({ error: "Server error" }, { status: 500 });
//   }
// }



import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function PATCH(req, { params }) {
  try {
    // 🔥 params must be awaited in Next.js 15
    const resolved = await params;
    const id = Number(resolved.id);

    // Token validation
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
      console.log(authHeader);

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Body parse
    let body = {};
    try {
      body = await req.json();
    } catch {}

    const { active } = body;

    // Update
    const updated = await prisma.user.update({
      where: { id },
      data: { active },
    });

    return Response.json({
      success: true,
      active: updated.active,
    });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
