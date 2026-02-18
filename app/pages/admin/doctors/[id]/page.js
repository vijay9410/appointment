"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Stethoscope } from "lucide-react";

export default function EditDoctorPage({ params }) {
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("adminTheme") === "dark";
    setDarkMode(storedTheme);

    async function loadDoctor() {
      const resolved = await params;
      const id = resolved.id;

      const res = await fetch(`/api/admin/doctors/${id}`);
      const data = await res.json();
      setDoctor(data);
      setLoading(false);
    }
    loadDoctor();
  }, [params]);

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await fetch(`/api/admin/doctors/${doctor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctor),
      });

      toast.success("Doctor updated!");
      router.push("/pages/admin/doctors");
    } catch {
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-10 text-gray-500">Loading...</div>;

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* Header */}
      <header
        className={`p-6 border-b flex justify-between items-center ${
          darkMode ? "bg-gray-950 border-gray-800" : "bg-white shadow-sm"
        }`}
      >
        <div className="flex items-center gap-3">
          <Stethoscope
            size={30}
            className={darkMode ? "text-purple-400" : "text-purple-600"}
          />
          <div>
            <h1 className="text-2xl font-bold">Edit Doctor</h1>
            <p className="text-gray-500 text-sm">Update doctor information</p>
          </div>
        </div>

        <button
          onClick={() => router.back()}
          className={`rounded-md px-3 py-2 flex items-center gap-2 ${
            darkMode
              ? "bg-gray-800 border border-gray-700 hover:bg-gray-700"
              : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
          }`}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </header>

      {/* Form Card */}
      <main className="max-w-3xl mx-auto p-6">
        <div
          className={`rounded-2xl p-10 border shadow-md ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={doctor.name}
                onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                  darkMode
                    ? "bg-gray-900 border-gray-700 focus:ring-purple-500 text-white"
                    : "bg-white border-gray-300 focus:ring-purple-500"
                }`}
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block font-medium mb-1">Specialization</label>
              <input
                type="text"
                value={doctor.speciality ?? doctor.specialization ?? ""}
                onChange={(e) =>
                  setDoctor({ ...doctor, speciality: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                  darkMode
                    ? "bg-gray-900 border-gray-700 focus:ring-purple-500 text-white"
                    : "bg-white border-gray-300 focus:ring-purple-500"
                }`}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-medium mb-1">Phone Number</label>
              <input
                type="text"
                value={doctor.phone || ""}
                onChange={(e) =>
                  setDoctor({ ...doctor, phone: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                  darkMode
                    ? "bg-gray-900 border-gray-700 focus:ring-purple-500 text-white"
                    : "bg-white border-gray-300 focus:ring-purple-500"
                }`}
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
