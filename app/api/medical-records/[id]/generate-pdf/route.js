import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const SECRET = process.env.JWT_SECRET;

export async function POST(req, context) {
  try {
    // ✅ 1. ID yahin se aayegi
    const { id } = await context.params;

    // ✅ 2. Auth check
    const auth = req.headers.get("authorization");
    if (!auth) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);

    // ✅ 3. Record fetch
    const record = await prisma.medicalRecord.findFirst({
      where: {
        id: Number(id),
        patient: { hospitalId: decoded.hospitalId },
      },
      include: {
        patient: true,
        user: true,
        appointment: true,
      },
    });

    if (!record) {
      return Response.json({ error: "Record not found" }, { status: 404 });
    }

    // ✅ 4. HTML (simple example)
    const html = `
      <h1>${record.title}</h1>
      <p>Doctor: ${record.user?.name}</p>
      <p>Patient: ${record.patient?.name}</p>
      <p>${record.description || ""}</p>
    `;

    // ✅ 5. PDF generate
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    // =================================================
    // 🔥 YAHI PE AATA HAI "LOCAL SAVE" WALA CODE
    // =================================================

    const fileName = `medical_record_${record.id}.pdf`;

    const filePath = path.join(
      process.cwd(),        // project root
      "public",
      "reports",
      "prescriptions",
      fileName
    );

    // folder ensure
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // file save
    fs.writeFileSync(filePath, pdfBuffer);

    // browser-accessible URL
    const fileUrl = `/reports/prescriptions/${fileName}`;

    // =================================================
    // 🔥 DB UPDATE
    // =================================================

    await prisma.medicalRecord.update({
      where: { id: record.id },
      data: { fileUrl },
    });

    return Response.json({
      message: "PDF generated and saved locally",
      fileUrl,
    });

  } catch (err) {
    console.error("Generate PDF Error:", err);
    return Response.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
