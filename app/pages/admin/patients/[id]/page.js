"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function EditPatientPage({ params }) {
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("adminTheme") === "dark";
    setDarkMode(savedTheme);

    async function loadPatient() {
      const resolved = await params;
      const id = resolved.id;

      const res = await fetch(`/api/admin/patients/${id}`);
      const data = await res.json();
      setPatient(data);
      setLoading(false);
    }
    loadPatient();
  }, [params]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    await fetch(`/api/admin/patients/${patient.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patient),
    });

    toast.success("Patient updated!");
    setSaving(false);
    router.push("/pages/admin/patients");
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      
      {/* Header */}
      <header className={`p-6 border-b flex justify-between items-center ${darkMode ? "bg-gray-950 border-gray-800" : "bg-white shadow-sm"}`}>
        <div className="flex items-center gap-3">
          <UserCircle size={32} className={darkMode ? "text-blue-300" : "text-blue-600"} />
          <div>
            <h1 className="text-2xl font-bold">Edit Patient</h1>
            <p className="text-sm text-gray-500">Modify patient details</p>
          </div>
        </div>

        <button
          onClick={() => router.back()}
          className={`px-4 py-2 rounded-md flex items-center gap-2
          ${darkMode ? "bg-gray-800 border border-gray-700 hover:bg-gray-700"
                     : "bg-gray-100 border border-gray-300 hover:bg-gray-200"}`}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </header>

      {/* Card Form */}
      <main className="max-w-3xl mx-auto p-6">
        <div className={`${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-200"} p-8 rounded-2xl shadow-md border`}>
          
          <form onSubmit={handleUpdate} className="space-y-6">

            <InputBox label="Full Name" value={patient.name ?? ""} darkMode={darkMode}
              onChange={(v) => setPatient({ ...patient, name: v })} />

            <InputBox label="Email" value={patient.email ?? ""} darkMode={darkMode}
              onChange={(v) => setPatient({ ...patient, email: v })} />

            <InputBox label="Phone" value={patient.phone ?? ""} darkMode={darkMode}
              onChange={(v) => setPatient({ ...patient, phone: v })} />

            <InputBox label="Age" value={patient.age ?? ""} type="number" darkMode={darkMode}
              onChange={(v) => setPatient({ ...patient, age: Number(v) })} />

            <div>
              <label className="block font-medium mb-1">Gender</label>
              <select
                value={patient.gender ?? ""}
                onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border outline-none
                ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"}`}
              >
                <option value="">Select...</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

/* Mini Component */
function InputBox({ label, value, onChange, darkMode, type="text" }) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border outline-none
        ${darkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}
      />
    </div>
  );
}
