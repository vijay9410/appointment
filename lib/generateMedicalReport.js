import PDFDocument from "pdfkit";
import fs from "fs";

export async function generateMedicalReport({
  hospital,
  patient,
  appointment,
  doctor,
  notes,
  outputPath,
}) {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(outputPath));

  // ===============================
  // HEADER
  // ===============================
  doc
    .fontSize(18)
    .fillColor("#2563eb")
    .text(hospital.name, { align: "center" });

  doc
    .fontSize(10)
    .fillColor("black")
    .text(hospital.address || "", { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(9)
    .fillColor("gray")
    .text("Committed to Excellence in Patient Care", { align: "center" });

  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

  // ===============================
  // PATIENT INFORMATION
  // ===============================
  doc.moveDown();
  doc.fontSize(14).text("Patient Information", { underline: true });

  doc.moveDown(0.5);
  doc.fontSize(11)
    .text(`Name: ${patient.name}`)
    .text(`Phone: ${patient.phone || "N/A"}`)
    .text(`Email: ${patient.email || "N/A"}`);

  // ===============================
  // APPOINTMENT INFO
  // ===============================
  doc.moveDown();
  doc.fontSize(14).text("Appointment Info", { underline: true });

  doc.moveDown(0.5);
  doc.fontSize(11)
    .text(`Status: ${appointment.status}`)
    .text(`Appointment ID: #${appointment.id}`)
    .text(`Title: ${appointment.title}`)
    .text(`Date: ${new Date(appointment.date).toLocaleString()}`)
    .text(`Doctor: ${doctor.name}`);

  // ===============================
  // DOCTOR HISTORY / NOTES
  // ===============================
  doc.moveDown();
  doc.fontSize(14).text("Doctor’s History Timeline", { underline: true });

  if (notes.length === 0) {
    doc.moveDown().fontSize(11).text("No notes available.");
  }

  notes.forEach((n) => {
    doc.moveDown();
    doc.fontSize(10).fillColor("gray")
      .text(new Date(n.createdAt).toLocaleString());

    doc.moveDown(0.3);
    doc.fillColor("black")
      .fontSize(11)
      .text(`Diagnosis: ${n.diagnosis || "N/A"}`)
      .text(`Prescription: ${n.prescription || "N/A"}`)
      .text(`Tests: ${n.tests || "N/A"}`)
      .text(
        `Follow-up: ${
          n.followUpDate
            ? new Date(n.followUpDate).toLocaleString()
            : "N/A"
        }`
      );
  });

  // ===============================
  // FOOTER
  // ===============================
  doc.moveDown(2);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

  doc.moveDown();
  doc.fontSize(10)
    .text(`Doctor: Dr. ${doctor.name}`)
    .text(`Qualification: ${doctor.qualification || "MBBS, MD"}`);

  doc.moveDown();
  doc.fontSize(8)
    .fillColor("gray")
    .text(
      "This report is confidential and intended for authorized medical use only.",
      { align: "center" }
    );

  doc.moveDown(0.5);
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    { align: "center" }
  );

  doc.end();
}
