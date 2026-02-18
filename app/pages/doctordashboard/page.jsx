"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  CalendarCheck2,
  CalendarClock,
  CalendarX,
  LogOut,
  Moon,
  Sun,
  Users2,
  Search as SearchIcon,
} from "lucide-react";
import Link from "next/link";

export default function DoctorDashboard() {
  const router = useRouter();

  /* ---------------- State ---------------- */
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [patientModal, setPatientModal] = useState(null);

  const mainRef = useRef(null);

  /* ---------------- Auth + Initial Fetch ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      toast.error("Please login first!");
      router.push("/pages/login");
      return;
    }
    if (role !== "DOCTOR") {
      toast.error("Access denied — only doctors allowed!");
      router.push("/pages/dashboard");
      return;
    }

    fetchDashboard();

    const onFocus = () => fetchDashboard();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Refetch on filter/date change ---------------- */
  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, selectedDate]);

  /* ---------------- Fetch Dashboard ---------------- */
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const doctorId = localStorage.getItem("doctorId");

      const params = new URLSearchParams();
      // params.append("doctorId", doctorId);
      if (filter !== "ALL") params.append("filter", filter);
      if (selectedDate) params.append("date", selectedDate);

      const res = await axios.get(`/api/doctor/dashboard?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const safeData = {
        current: [...(res.data?.data?.current || [])],
        upcoming: [...(res.data?.data?.upcoming || [])],
        past: [...(res.data?.data?.past || [])],
      };

      safeData.current.sort((a, b) => new Date(a.date) - new Date(b.date));
      safeData.upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
      safeData.past.sort((a, b) => new Date(b.date) - new Date(a.date));

      setDashboardData({
        summary: res.data.summary,
        data: safeData,
        message: res.data.message,
      });
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Logout ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("doctorId");
    toast.success("Logged out");
    router.push("/pages/login");
  };

  /* ---------------- Search Filter ---------------- */
  const applySearch = (list) => {
    const q = search.trim().toLowerCase();
    if (!q) return list;

    return list.filter((item) => {
      const name = item?.patient?.name?.toLowerCase() || "";
      const title = item?.title?.toLowerCase() || "";
      const phone = item?.patient?.phone || "";

      return (
        name.includes(q) ||
        title.includes(q) ||
        phone.includes(q) ||
        String(item.id).includes(q)
      );
    });
  };

  /* ---------------- Fetch Patient Modal Details ---------------- */
  const openPatientModal = async (patientId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/patient/summary/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatientModal(res.data);
    } catch {
      toast.error("Unable to load patient info");
    }
  };

  /* ---------------- Appointment Status Update ---------------- */
  const onActionClick = async (item, status) => {
    if (!confirm(`Mark appointment #${item.id} as ${status}?`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        "/api/appointment/status",
        { appointmentId: item.id, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Status updated");
      fetchDashboard();
    } catch {
      toast.error("Update failed");
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  /* ---------------- Loading & Error (MATCH USER DASHBOARD) ---------------- */
  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-700"
        }`}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-700"
        }`}
      >
        <h1 className="text-red-500 text-lg">No data available</h1>
      </div>
    );
  }

  const { summary, data, message } = dashboardData;

  const currentList = applySearch(data.current);
  const upcomingList = applySearch(data.upcoming);
  const pastList = applySearch(data.past);

  /* ---------------- UI (THEME MATCHED) ---------------- */
  return (
    <div
      ref={mainRef}
      className={`min-h-screen transition-all duration-500 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* Header */}
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
              Doctor Dashboard
            </h1>
            <p className="text-gray-500 mt-1">{message}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mt-4 md:mt-0">
          {/* Search */}
          <div
            className={`flex items-center px-3 py-2 rounded-md border text-sm ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-100"
                : "bg-gray-50 border-gray-300 text-gray-800"
            }`}
          >
            <SearchIcon
              size={16}
              className={darkMode ? "text-gray-400" : "text-gray-400"}
            />
            <input
              placeholder="Search by name, phone, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`ml-2 outline-none bg-transparent w-40 md:w-56 ${
                darkMode ? "placeholder-gray-500" : "placeholder-gray-400"
              }`}
            />
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`px-3 py-2 rounded-md border text-sm ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-100"
                : "bg-gray-50 border-gray-300 text-gray-800"
            }`}
          >
            <option value="ALL">All</option>
            <option value="TODAY">Today</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="PAST">Past</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`px-3 py-2 rounded-md border text-sm ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-100"
                : "bg-gray-50 border-gray-300 text-gray-800"
            }`}
          />

          {/* Theme Toggle */}
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

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all shadow-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Summary Cards (same style as UserDashboard) */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6">
        <SummaryCard
          icon={<CalendarCheck2 className="text-green-600" />}
          title="Today's Patients"
          value={summary.current}
          accent="green"
          dark={darkMode}
        />
        <SummaryCard
          icon={<CalendarClock className="text-yellow-600" />}
          title="Upcoming"
          value={summary.upcoming}
          accent="yellow"
          dark={darkMode}
        />
        <SummaryCard
          icon={<CalendarX className="text-red-600" />}
          title="Completed"
          value={summary.past}
          accent="red"
          dark={darkMode}
        />
        <SummaryCard
          icon={<Users2 className="text-blue-600" />}
          title="Total Patients"
          value={summary.totalPatients}
          accent="blue"
          dark={darkMode}
        />
      </section>

      {/* Appointment Columns (same grid, same spacing as user) */}
      <main className="p-6 grid md:grid-cols-3 gap-6">
        <DoctorAppointmentCard
          title="Today's Appointments"
          list={currentList}
          accent="blue"
          dark={darkMode}
          onActionClick={onActionClick}
          openPatientModal={openPatientModal}
        />
        <DoctorAppointmentCard
          title="Upcoming Appointments"
          list={upcomingList}
          accent="green"
          dark={darkMode}
          onActionClick={onActionClick}
          openPatientModal={openPatientModal}
        />
        <DoctorAppointmentCard
          title="Past Appointments"
          list={pastList}
          accent="gray"
          dark={darkMode}
          onActionClick={onActionClick}
          openPatientModal={openPatientModal}
        />
      </main>

      {/* Patient Modal (kept, but styled to match theme) */}
      {patientModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div
            className={`rounded-lg p-6 w-96 shadow-lg ${
              darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
            }`}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Patient Details</h2>
              <button
                onClick={() => setPatientModal(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>

            <div className="mt-4 space-y-1 text-sm">
              <p>
                <span className="font-semibold">Name:</span> {patientModal.name}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {patientModal.phone}
              </p>
            </div>

            <h3 className="mt-4 font-semibold text-sm">
              Recent Appointments
            </h3>
            <div className="h-40 overflow-y-auto mt-2 space-y-2">
              {patientModal.recent?.map((r) => (
                <div
                  key={r.id}
                  className={`border p-2 rounded text-sm ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {new Date(r.date).toLocaleString()} — {r.status}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
}

/* ---------- SummaryCard (same as UserDashboard) ---------- */
function SummaryCard({ icon, title, value, accent, dark }) {
  const accentColor = dark
    ? accent === "green"
      ? "border-green-500 text-green-400"
      : accent === "blue"
      ? "border-blue-500 text-blue-400"
      : accent === "yellow"
      ? "border-yellow-500 text-yellow-400"
      : "border-gray-600 text-gray-300"
    : accent === "green"
    ? "border-green-300 text-green-700"
    : accent === "blue"
    ? "border-blue-300 text-blue-700"
    : accent === "yellow"
    ? "border-yellow-300 text-yellow-700"
    : "border-gray-300 text-gray-700";

  return (
    <div
      className={`rounded-xl p-4 flex items-center gap-4 border transition-all duration-300 hover:scale-[1.02] ${
        dark
          ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
          : "bg-white shadow-sm hover:shadow-md"
      } ${accentColor}`}
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h3
          className={`text-2xl font-bold ${
            dark ? "text-white" : "text-black"
          }`}
        >
          {value}
        </h3>
      </div>
    </div>
  );
}

/* ---------- DoctorAppointmentCard (same design as AppointmentCard + actions) ---------- */
function DoctorAppointmentCard({
  title,
  list,
  accent,
  dark,
  onActionClick,
  openPatientModal,
}) {
  return (
    <div
      className={`rounded-2xl p-5 border transition-all duration-300 ${
        dark
          ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
          : "bg-white border-gray-200 shadow-sm hover:shadow-lg"
      }`}
    >
      <h2
        className={`text-lg font-semibold mb-4 border-b-2 pb-2 ${
          accent === "blue"
            ? dark
              ? "border-blue-500 text-blue-400"
              : "border-blue-300 text-blue-700"
            : accent === "green"
            ? dark
              ? "border-green-500 text-green-400"
              : "border-green-300 text-green-700"
            : dark
            ? "border-gray-600 text-gray-300"
            : "border-gray-300 text-gray-700"
        }`}
      >
        {title}
      </h2>

      {Array.isArray(list) && list.length > 0 ? (
        <div className="space-y-4">
          {list.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl p-4 border transition-all duration-200 ${
                dark
                  ? "bg-gray-900 border-gray-700 hover:bg-gray-800"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                {/* Left: patient info */}
                <div className="flex-1">
                  <button
                    type="button"
                    className={`font-semibold hover:underline ${
                      dark ? "text-white" : "text-gray-900"
                    }`}
                    onClick={() => openPatientModal(item.patientId)}
                  >
                    {item.patient?.name || "Unknown"}
                  </button>

                  <div
                    className={`mt-2 space-y-1 text-sm ${
                      dark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <p>
                      📅{" "}
                      {item.date
                        ? new Date(item.date).toLocaleString()
                        : "N/A"}
                    </p>
                    <p>🩺 {item.title || "No title"}</p>
                    <p>📞 {item.patient?.phone || "N/A"}</p>
                  </div>

                  {/* Status badge */}
                  <div className="mt-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === "COMPLETED"
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : item.status === "CANCELLED"
                          ? "bg-red-100 text-red-700 border border-red-300"
                          : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                      }`}
                    >
                      {item.status || "PENDING"}
                    </span>
                  </div>
                </div>
                {/* Right: actions */}
                <div className="flex flex-col items-end gap-2">
                  <Link
                    href={`/pages/doctordashboard/${item.id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                  >
                    View
                  </Link>

                  {/* Show buttons ONLY IF status NOT completed/cancelled */}
                  {item.status !== "COMPLETED" && item.status !== "CANCELLED" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onActionClick(item, "COMPLETED")}
                        className="px-2 py-1 text-xs bg-green-200 text-green-700 rounded hover:bg-green-300"
                      >
                        ✔
                      </button>
                      <button
                        onClick={() => onActionClick(item, "CANCELLED")}
                        className="px-2 py-1 text-xs bg-red-200 text-red-700 rounded hover:bg-red-300"
                      >
                        ✖
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <p
          className={`text-sm italic ${
            dark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          No appointments found
        </p>
      )}
    </div>
  );
}
