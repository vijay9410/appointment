"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  CalendarDays,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Moon,
  Sun,
  Edit,
  Trash2,
} from "lucide-react";

export default function AdminAppointmentsPage() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("/api/admin/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments(res.data);
      setLoading(false);
    } catch (e) {
      toast.error("Failed to load appointments");
      router.push("/pages/login");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  const deleteAppointment = async (id) => {
    if (!confirm("Cancel this appointment?")) return;

    try {
      await axios.delete(`/api/admin/appointments/${id}`);
      toast.success("Appointment cancelled");
      fetchAppointments();
    } catch {
      toast.error("Failed to cancel");
    }
  };

  const filtered = appointments.filter(
    (a) =>
      a.patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctor?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
        }`}
      >
        Loading Appointments...
      </div>
    );

  const pendingCount = appointments.filter((a) => a.status === "PENDING").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;
  const cancelledCount = appointments.filter((a) => a.status === "CANCELLED").length;

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
          <CalendarDays
            size={32}
            className={darkMode ? "text-blue-400" : "text-blue-600"}
          />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Appointments Management
            </h1>
            <p className="text-gray-500">
              Monitor, track & manage all appointments
            </p>
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
          icon={<Clock className="text-blue-600" />}
          title="Total Appointments"
          value={appointments.length}
          dark={darkMode}
        />

        <SummaryCard
          icon={<Clock className="text-yellow-600" />}
          title="Pending"
          value={pendingCount}
          dark={darkMode}
        />

        <SummaryCard
          icon={<CheckCircle className="text-green-600" />}
          title="Completed"
          value={completedCount}
          dark={darkMode}
        />

        <SummaryCard
          icon={<XCircle className="text-red-600" />}
          title="Cancelled"
          value={cancelledCount}
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
            placeholder="Search doctor or patient..."
            className="outline-none bg-transparent text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Appointments Table */}
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
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((a) => (
                  <tr
                    key={a.id}
                    className={`border-t ${
                      darkMode
                        ? "border-gray-700 hover:bg-gray-750"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">
                      {a.patient?.name}
                    </td>
                    <td className="px-4 py-3">{a.doctor?.name}</td>
                    <td className="px-4 py-3">{a.date}</td>
                    <td className="px-4 py-3">{a.time}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          a.status === "COMPLETED"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : a.status === "CANCELLED"
                            ? "bg-red-100 text-red-700 border border-red-300"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 flex justify-end gap-3">
                      <button
                        onClick={() =>
                          router.push(`/pages/admin/appointments/edit/${a.id}`)
                        }
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => deleteAppointment(a.id)}
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
                    No appointments found.
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

/* SUMMARY CARD */
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
