"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Users,
  UserPlus,
  Search,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  ArrowLeft,
  Moon,
  Sun,
  UserCircle,
} from "lucide-react";

export default function AdminPatientsPage() {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("/api/admin/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPatients(res.data);
      setLoading(false);
    } catch (e) {
      toast.error("Failed to load patients");
      router.push("/pages/login");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  const deletePatient = async (id) => {
    if (!confirm("Delete patient permanently?")) return;

    try {
      await axios.delete(`/api/admin/patients/${id}`);
      toast.success("Patient removed");
      fetchPatients();
    } catch {
      toast.error("Failed to delete patient");
    }
  };

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
        }`}
      >
        Loading Patients...
      </div>
    );

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
          <UserCircle
            size={32}
            className={darkMode ? "text-blue-400" : "text-blue-600"}
          />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Patients Management
            </h1>
            <p className="text-gray-500">Manage, review & update patients</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/pages/userdashboard")}
            className={`rounded-md px-3 py-2 flex items-center gap-2 ${
              darkMode
                ? "bg-gray-800 border border-gray-700 hover:bg-gray-700"
                : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            onClick={() => router.push("/pages/admin/patients/add")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow"
          >
            <UserPlus size={18} /> Add Patient
          </button>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border ${
              darkMode
                ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                : "bg-gray-100 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="p-6 flex justify-end">
        <div
          className={`flex items-center gap-2 border rounded-xl px-4 py-2 shadow-sm ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Search patient..."
            className="outline-none bg-transparent text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Patients Table */}
      <main className="px-6 pb-10 max-w-6xl mx-auto">
        <div
          className={`rounded-2xl overflow-hidden border shadow-md ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <table className="w-full text-sm">
            <thead
              className={`${
                darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100"
              }`}
            >
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className={`border-t ${
                      darkMode
                        ? "border-gray-700 hover:bg-gray-750"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3">{p.email}</td>
                    <td className="px-4 py-3">{p.phone || "N/A"}</td>
                    <td className="px-4 py-3">{p.age || "—"}</td>
                    <td className="px-4 py-3">{p.gender || "—"}</td>

                    <td className="px-4 py-3 flex justify-end gap-3">
                      <button
                        onClick={() =>
                          router.push(`/pages/admin/patients/${p.id}`)
                        }
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => deletePatient(p.id)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="py-6 text-center text-gray-500 italic"
                  >
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Toaster position="top-center" />
    </div>
  );
}
