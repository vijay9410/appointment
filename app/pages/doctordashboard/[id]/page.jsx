"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  ClipboardList,
  Moon,
  Sun,
  Stethoscope,
  FileText,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function AppointmentDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [appointment, setAppointment] = useState(null);
  const [formData, setFormData] = useState({
    diagnosis: "",
    prescription: "",
    tests: "",
    followUpDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // 👉 Only this part will go to the PDF
  const printRef = useRef(null);

  /* ---------------- Fetch Appointment ---------------- */
  const fetchAppointment = async () => {
    try {
      const res = await axios.get(`/api/appointment/${id}`);
      setAppointment(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load appointment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchAppointment();
  }, [id]);

  /* ---------------- Save Doctor Notes ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.diagnosis.trim() &&
      !formData.prescription.trim() &&
      !formData.tests.trim() &&
      !formData.followUpDate
    ) {
      toast.error("Please fill at least one field before saving");
      return;
    }

    try {
      await axios.put("/api/appointment/update", {
        appointmentId: id,
        ...formData,
      });

      toast.success("Doctor note saved successfully!");
      console.log(id);
      await fetchAppointment();

      setFormData({
        diagnosis: "",
        prescription: "",
        tests: "",
        followUpDate: "",
      });
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Error updating appointment!");
    }
  };

  /* ---------------- Download as Professional PDF ---------------- */
  const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element) {
      toast.error("No content found!");
      return;
    }

    toast.loading("Preparing professional report...", { id: "pdf" });

    try {
      const cloned = element.cloneNode(true);
      cloned.style.backgroundColor = "#ffffff";
      cloned.style.color = "#000";
      cloned.style.padding = "20px";
      cloned.style.width = "794px"; // A4 width
      cloned.style.boxSizing = "border-box";
      cloned.style.fontFamily = "Arial, sans-serif";
      cloned.style.position = "relative";

      // ----- Header -----
      const header = document.createElement("div");
      header.style.textAlign = "center";
      header.style.borderBottom = "2px solid #2563eb";
      header.style.paddingBottom = "10px";
      header.style.marginBottom = "20px";

      const logo = document.createElement("img");
      logo.src = "/logo.png"; // place logo in /public
      logo.style.width = "70px";
      logo.style.height = "70px";
      logo.style.objectFit = "contain";
      logo.style.marginBottom = "5px";

      const title = document.createElement("h2");
      title.textContent = "Medicent Healthcare Clinic";
      title.style.fontSize = "22px";
      title.style.margin = "0";
      title.style.color = "#2563eb";

      const address = document.createElement("p");
      address.textContent =
        "22 Park Avenue, Sector 11, Lucknow, Uttar Pradesh - 226010";
      address.style.fontSize = "12px";
      address.style.color = "#4b5563";
      address.style.margin = "2px 0";

      const contact = document.createElement("p");
      contact.textContent =
        "📞 +91-9876543210 | ✉️ contact@medicentclinic.in";
      contact.style.fontSize = "12px";
      contact.style.color = "#4b5563";
      contact.style.margin = "2px 0";

      const tagline = document.createElement("p");
      tagline.textContent = "“Committed to Excellence in Patient Care”";
      tagline.style.fontSize = "11px";
      tagline.style.color = "#6b7280";
      tagline.style.marginTop = "4px";
      tagline.style.fontStyle = "italic";

      header.appendChild(logo);
      header.appendChild(title);
      header.appendChild(address);
      header.appendChild(contact);
      header.appendChild(tagline);
      cloned.prepend(header);

      // ----- Footer -----
      const footer = document.createElement("div");
      footer.style.textAlign = "center";
      footer.style.marginTop = "40px";
      footer.style.fontSize = "11px";
      footer.style.color = "#6b7280";
      footer.innerHTML = `
        <hr style="border: 0.5px solid #ccc; margin-bottom: 8px;" />
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="text-align:left;">
            <p><b>Doctor’s Name:</b> Dr. ${
              appointment.doctor?.name || "Assigned Doctor"
            }</p>
            <p><b>Qualification:</b> MBBS, MD (General Medicine)</p>
          </div>
          <div style="text-align:right;">
            <p>_____________________________</p>
            <p>Doctor’s Signature</p>
          </div>
        </div>
        <p style="margin-top:10px;">Generated on: ${new Date().toLocaleString()}</p>
        <p style="margin-top:3px; font-style:italic; color:#9ca3af;">
          This report is confidential and intended for authorized medical use only.
        </p>
      `;
      cloned.appendChild(footer);

      // ----- Watermark -----
      const watermark = document.createElement("div");
      watermark.textContent = "CONFIDENTIAL";
      watermark.style.position = "absolute";
      watermark.style.top = "50%";
      watermark.style.left = "50%";
      watermark.style.transform = "translate(-50%, -50%) rotate(-30deg)";
      watermark.style.fontSize = "60px";
      watermark.style.fontWeight = "bold";
      watermark.style.color = "rgba(200,200,200,0.12)";
      watermark.style.zIndex = "0";
      watermark.style.pointerEvents = "none";
      cloned.appendChild(watermark);

      cloned.style.border = "1px solid #e5e7eb";
      cloned.style.boxShadow = "0 0 5px rgba(0,0,0,0.1)";

      // Render in hidden iframe
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.left = "-9999px";
      iframe.width = "794";
      iframe.height = "1123";
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(
        "<!DOCTYPE html><html><head><title>Medical Report</title></head><body></body></html>"
      );
      doc.close();
      doc.body.appendChild(cloned);

      await new Promise((r) => setTimeout(r, 300));

      const canvas = await html2canvas(cloned, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        scrollY: 0,
        logging: false,
      });

      document.body.removeChild(iframe);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let yPos = 0;
      pdf.addImage(imgData, "PNG", 0, yPos, pdfWidth, pdfHeight);

      let heightLeft = pdfHeight - pdf.internal.pageSize.getHeight();
      while (heightLeft > 0) {
        yPos = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, yPos, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save(
        `Medical_Report_${appointment.patient?.name || "Patient"}_${
          appointment.id
        }.pdf`
      );

      toast.success("Professional report downloaded successfully!", {
        id: "pdf",
      });
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("Failed to generate professional report!", { id: "pdf" });
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  /* ---------------- Loading / Empty ---------------- */
  if (loading)
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-700"
        }`}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p className="font-medium">Loading appointment...</p>
        </div>
      </div>
    );

  if (!appointment)
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-700"
        }`}
      >
        <h1 className="text-red-500 text-lg">Appointment not found</h1>
      </div>
    );

  /* ---------------- UI ---------------- */
  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* Header – same style as UserDashboard / DoctorDashboard */}
      <header
        className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b ${
          darkMode ? "border-gray-800 bg-gray-950" : "bg-white shadow-sm"
        }`}
      >
        <div className="flex items-center gap-3">
          <Stethoscope
            size={32}
            className={darkMode ? "text-blue-400" : "text-blue-600"}
          />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Appointment Details
            </h1>
            <p className="text-gray-500 mt-1">
              {appointment.patient?.name || "Unknown Patient"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-all shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all shadow-sm"
          >
            <Download size={16} /> PDF
          </button>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-all ${
              darkMode
                ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                : "bg-gray-100 hover:bg-gray-200 border-gray-300"
            }`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content – spacing & look matched to dashboard */}
      <main className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Printable Area */}
        <div ref={printRef} className="space-y-6">
          {/* Top two info cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Patient Info */}
            <section
              className={`rounded-xl p-5 border transition-all duration-300 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-blue-500">
                <ClipboardList size={20} /> Patient Information
              </h2>
              <div className="space-y-1 text-sm">
                <p>
                  <b>Name:</b> {appointment.patient?.name || "N/A"}
                </p>
                <p>
                  <b>Phone:</b> {appointment.patient?.phone || "N/A"}
                </p>
                <p>
                  <b>Email:</b> {appointment.patient?.email || "N/A"}
                </p>
              </div>
            </section>

            {/* Appointment Info */}
            <section
              className={`rounded-xl p-5 border transition-all duration-300 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold mb-3 text-green-500">
                  Appointment Info
                </h2>
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                    appointment.status === "COMPLETED"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : appointment.status === "CANCELLED"
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                  }`}
                >
                  {appointment.status || "PENDING"}
                </span>
              </div>

              <div className="space-y-1 text-sm">
                <p>
                  <b>Appointment ID:</b> #{appointment.id}
                </p>
                <p>
                  <b>Title:</b> {appointment.title}
                </p>
                <p>
                  <b>Date:</b>{" "}
                  {appointment.date
                    ? new Date(appointment.date).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <b>Notes:</b> {appointment.notes || "N/A"}
                </p>
                <p>
                  <b>Doctor:</b> {appointment.doctor?.name || "Assigned Doctor"}
                </p>
              </div>
            </section>
          </div>

          {/* Doctor Notes History / Timeline */}
          {appointment.doctorNotes?.length > 0 ? (
            <section
              className={`rounded-xl p-5 border transition-all duration-300 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <h2 className="text-xl font-semibold mb-3 text-indigo-500 flex items-center gap-2">
                <FileText size={20} /> Doctor’s History Timeline
              </h2>

              <div className="space-y-4">
                {appointment.doctorNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`border-l-4 border-blue-500 pl-4 py-3 rounded-md ${
                      darkMode ? "bg-gray-900" : "bg-gray-50"
                    }`}
                  >
                    <p className="text-xs text-gray-500 mb-1">
                      🕒{" "}
                      {note.createdAt
                        ? new Date(note.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                    <p className="text-sm">
                      <b>Diagnosis:</b> {note.diagnosis || "—"}
                    </p>
                    <p className="text-sm">
                      <b>Prescription:</b> {note.prescription || "—"}
                    </p>
                    <p className="text-sm">
                      <b>Tests:</b> {note.tests || "—"}
                    </p>
                    <p className="text-sm">
                      <b>Follow-up:</b>{" "}
                      {note.followUpDate
                        ? new Date(note.followUpDate).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <p
              className={`text-sm italic text-center ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No doctor notes yet. Add one below 👇
            </p>
          )}
        </div>

        {/* Add / Update Doctor Notes – NOT included in PDF */}
        <form
          onSubmit={handleSubmit}
          className={`rounded-xl p-5 border transition-all duration-300 space-y-4 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <h2 className="text-xl font-semibold text-indigo-500">
            Add / Update Doctor Notes
          </h2>

          <textarea
            placeholder="Diagnosis"
            className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.diagnosis}
            onChange={(e) =>
              setFormData({ ...formData, diagnosis: e.target.value })
            }
          />

          <textarea
            placeholder="Prescription"
            className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.prescription}
            onChange={(e) =>
              setFormData({ ...formData, prescription: e.target.value })
            }
          />

          <textarea
            placeholder="Tests Recommended"
            className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.tests}
            onChange={(e) =>
              setFormData({ ...formData, tests: e.target.value })
            }
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Follow-up Date
            </label>
            <input
              type="datetime-local"
              className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.followUpDate}
              onChange={(e) =>
                setFormData({ ...formData, followUpDate: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
          >
            Save Doctor Note
          </button>
        </form>
      </main>

      <Toaster position="top-center" />
    </div>
  );
}

