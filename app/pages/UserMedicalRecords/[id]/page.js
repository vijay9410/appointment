"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye, Download, FilePlus } from "lucide-react";
import { toast } from "react-hot-toast";

export default function MedicalRecordDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      router.push("/pages/login");
      return;
    }

    fetchRecord(token);
  }, []);

  const fetchRecord = async (token) => {
    try {
      const res = await axios.get(`/api/medical-records/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecord(res.data.record);
    } catch (err) {
      toast.error("Failed to load medical report");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NEW: Generate PDF
  const generatePdf = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setGenerating(true);

      await axios.post(
        `/api/medical-records/${id}/generate-pdf`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("PDF generated successfully");
      window.location.reload(); // simplest & safe
    } catch (err) {
      toast.error("Failed to generate PDF");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!record) return <p className="p-6">Record not found</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-600 font-medium mb-6"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* MAIN CARD */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        {/* TITLE */}
        <h1 className="text-2xl font-bold text-gray-500">{record.title}</h1>

        {/* META INFO */}
        <div className="space-y-1 text-sm text-gray-700">
          <p><b>Type:</b> {record.type}</p>
          <p><b>Date:</b> {new Date(record.createdAt).toLocaleDateString()}</p>
          {record.user?.name && <p><b>Doctor:</b> {record.user.name}</p>}
          {record.patient?.name && <p><b>Patient:</b> {record.patient.name}</p>}
          {record.appointment?.title && (
            <p><b>Appointment:</b> {record.appointment.title}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        {record.description && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-500">Description</h3>
            <p className="text-gray-700">{record.description}</p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-6 flex gap-3 flex-wrap">
          {/* Generate PDF (when no file) */}
          {!record.fileUrl && (
            <button
              onClick={generatePdf}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              <FilePlus size={18} />
              {generating ? "Generating..." : "Generate PDF"}
            </button>
          )}

          {/* Preview + Download (when file exists) */}
          {record.fileUrl && (
            <>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                <Eye size={18} /> {showPreview ? "Hide Preview" : "Preview"}
              </button>

              <a
                href={record.fileUrl}
                target="_blank"
                download
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                <Download size={18} /> Download
              </a>
            </>
          )}
        </div>

        {/* PREVIEW BOX */}
        {showPreview && record.fileUrl && (
          <div className="mt-6 border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600">
              Report Preview
            </div>

            {record.fileUrl.endsWith(".pdf") ? (
              <iframe src={record.fileUrl} className="w-full h-96" />
            ) : (
              <img
                src={record.fileUrl}
                className="w-full max-h-96 object-contain"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
