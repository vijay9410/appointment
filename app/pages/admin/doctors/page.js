"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  BarChart3,
  Users,
  Stethoscope,
  UserPlus,
  Search,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  ArrowLeft,
  Moon,
  Sun,
} from "lucide-react";

export default function AdminDoctorsPage() {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("/api/admin/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDoctors(res.data);
      setLoading(false);
    } catch (e) {
      toast.error("Failed to load doctors");
      router.push("/pages/login");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  const deleteDoctor = async (id) => {
    if (!confirm("Delete doctor permanently?")) return;

    try {
      await axios.delete(`/api/admin/doctors/${id}`);
      toast.success("Doctor removed");
      fetchDoctors();
    } catch {
      toast.error("Failed to delete doctor");
    }
  };
  const toggleStatus = async (id, current) => {
  try {
    await axios.patch(
      `/api/admin/doctors/status/${id}`,
      { active: !current },  // ← BODY
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ← HEADERS
        },
      }
    );

    toast.success("Status updated");
    fetchDoctors();
  } catch (err) {
    console.log("PATCH ERROR:", err.response?.data);
    toast.error("Failed to update");
  }
};


  const filtered = doctors.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = doctors.filter((d) => d.active).length;
  const inactiveCount = doctors.filter((d) => !d.active).length;

  if (loading)
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
        }`}
      >
        Loading Doctors...
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
          <Stethoscope
            size={32}
            className={darkMode ? "text-purple-400" : "text-purple-600"}
          />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Doctors Management
            </h1>
            <p className="text-gray-500">Manage, review & update doctors</p>
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
            onClick={() => router.push("/pages/admin/doctors/add")}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 shadow"
          >
            <UserPlus size={18} /> Add Doctor
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

      {/* Summary Cards */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6">
        <SummaryCard
          icon={<Users className="text-blue-600" />}
          title="Total Doctors"
          value={doctors.length}
          dark={darkMode}
        />

        <SummaryCard
          icon={<CheckCircle className="text-green-600" />}
          title="Active Doctors"
          value={activeCount}
          dark={darkMode}
        />

        <SummaryCard
          icon={<XCircle className="text-red-600" />}
          title="Inactive Doctors"
          value={inactiveCount}
          dark={darkMode}
        />

        <SummaryCard
          icon={<Stethoscope className="text-purple-600" />}
          title="Specializations"
          value={new Set(doctors.map((d) => d.specialization)).size}
          dark={darkMode}
        />
      </section>

      {/* Search */}
      <div className="p-6 flex justify-end">
        <div
          className={`flex items-center gap-2 border rounded-xl px-4 py-2 shadow-sm ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Search doctor..."
            className="outline-none bg-transparent text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Doctors Table */}
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
                <th className="px-4 py-3">Specialization</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((d) => (
                  <tr
                    key={d.id}
                    className={`border-t ${
                      darkMode
                        ? "border-gray-700 hover:bg-gray-750"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">{d.name}</td>
                    <td className="px-4 py-3">{d.email}</td>
                    <td className="px-4 py-3">{d.phone || "N/A"}</td>
                    <td className="px-4 py-3">
                      {d.specialization || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          d.active
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                        }`}
                      >
                        {d.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-3 flex justify-end gap-3">
                      <button
                        onClick={() => toggleStatus(d.id, d.active)}
                        className={`p-2 rounded-lg ${
                          d.active
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {d.active ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>

                      <button
                        onClick={() =>
                          router.push(`/pages/admin/doctors/${d.id}`)
                        }
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => deleteDoctor(d.id)}
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
                    No doctors found.
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

/* SUMMARY CARD (Admin Dashboard Style) */
function SummaryCard({ icon, title, value, dark }) {
  return (
    <div
      className={`rounded-xl p-4 flex items-center gap-4 border transition-all hover:scale-[1.02] ${
        dark
          ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
          : "bg-white shadow-sm hover:shadow-md border-gray-200"
      }`}
    >
      <div className="text-3xl">{icon}</div>

      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className={`text-2xl font-bold ${dark ? "text-white" : "text-black"}`}>
          {value}
        </h3>
      </div>
    </div>
  );
}
