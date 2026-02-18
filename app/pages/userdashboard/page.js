"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  UserCircle2,
  CalendarCheck2,
  CalendarClock,
  CalendarX,
  LogOut,
  Moon,
  Sun,
  PlusCircle,
} from "lucide-react";

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    notes: "",
    doctorId: "",
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      toast.error("Please login first!");
      router.push("/pages/login");
      return;
    }

    if (role !== "USER") {
     // toast.error("Access denied — only users allowed!");
      router.push("/pages/dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get("/api/user/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("DASHBOARD DATA:", dashboardData);
        setDashboardData(res.data);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchDoctors();
  }, [router]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("/api/doctors");
      setDoctors(res.data);
    } catch {
     // toast.error("Failed to load doctors");
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!formData.title || !formData.date || !formData.doctorId) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await axios.post("/api/bookappointment/create", {
        ...formData,
        userId,
        patientId: userId,
      });
      toast.success("Appointment booked successfully!");
      setShowModal(false);
      setFormData({ title: "", date: "", notes: "", doctorId: "" });

      const res = await axios.get("/api/user/dashboard", {
     headers: { Authorization: `Bearer ${token}` },
      });
      console.log("DASHBOARD DATA:", dashboardData);
      setDashboardData(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Booking failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully!");
    router.push("/pages/login");
  };

  const toggleTheme = () => setDarkMode(!darkMode);

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

  return (
    <div
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
          <UserCircle2
            size={32}
            className={darkMode ? "text-blue-400" : "text-blue-600"}
          />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              User Dashboard
            </h1>
            <p className="text-gray-500 mt-1">{message}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button
            onClick={() => router.push("/pages/BookAppointment")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm"
          >
            <PlusCircle size={18} /> Book Appointment
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

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all shadow-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6">
        <SummaryCard
          icon={<CalendarCheck2 className="text-green-600" />}
          title="Today's Appointments"
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
          title="Past"
          value={summary.past}
          accent="red"
          dark={darkMode}
        />
        <SummaryCard
          icon={<CalendarCheck2 className="text-blue-600" />}
          title="Total Appointments"
          value={summary.total}
          accent="blue"
          dark={darkMode}
        />
      </section>

      {/* QUICK ACTIONS */}
      <div className="mt-10 px-6">
        <h2 className={`text-xl font-bold mb-5 ${darkMode ? "text-white" : "text-gray-800"}`}>
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              title: "Book Appointment",
              iconBg: "bg-blue-100",
              iconColor: "text-blue-600",
              route: "/pages/BookAppointment",
              iconPath: "M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2 -2H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2z",
            },
            {
              title: "Medical Records",
              iconBg: "bg-purple-100",
              iconColor: "text-purple-600",
              route: "/pages/UserMedicalRecords",
              iconPath: "M12 6v6l4 2m5 -2a9 9 0 1 1 -18 0 9 9 0 0 1 18 0z",
            },
            {
              title: "Follow-up Reminders",
              iconBg: "bg-yellow-100",
              iconColor: "text-yellow-600",
              route: "/pages/userdashboard/followups",
              iconPath: "M12 6v6l3 3m6 -3a9 9 0 1 1 -18 0 9 9 0 0 1 18 0z",
            },
            {
              title: "All Appointments",
              iconBg: "bg-green-100",
              iconColor: "text-green-600",
              route: "scroll-appointments",
              iconPath: "M3 7h18M3 12h18M3 17h18",
            },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (item.route === "scroll-appointments") {
                  const section = document.getElementById("appointmentsSection");
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                } else {
                  router.push(item.route);
                }
              }}
              className={`
                cursor-pointer rounded-2xl p-5 border transition-all shadow-sm
                flex flex-col items-center text-center hover:shadow-md hover:scale-[1.02]
                ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }
              `}
            >
              <div className={`${item.iconBg} p-4 rounded-full mb-3`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-8 h-8 ${item.iconColor}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.iconPath} />
                </svg>
              </div>
              <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Lists */}
      <main id="appointmentsSection" className="p-6 grid md:grid-cols-3 gap-6">
        <AppointmentCard title="Today's Appointments" list={data.current} accent="blue" dark={darkMode} />
        <AppointmentCard title="Upcoming Appointments" list={data.upcoming} accent="green" dark={darkMode} />
        <AppointmentCard title="Past Appointments" list={data.past} accent="gray" dark={darkMode} />
      </main>

      <Toaster position="top-center" />
    </div>
  );
}


/* ---------- SummaryCard ---------- */
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
        <h3 className={`text-2xl font-bold ${dark ? "text-white" : "text-black"}`}>{value}</h3>
      </div>
    </div>
  );
}

/* ---------- AppointmentCard ---------- */
function AppointmentCard({ title, list, accent, dark }) {
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
              <h3 className={`font-semibold ${dark ? "text-white" : "text-gray-800"}`}>
                {item.title || "Untitled Appointment"}
              </h3>

              <div className={`mt-2 space-y-1 text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
                <p>📅 {item.date ? new Date(item.date).toLocaleString() : "N/A"}</p>
                <p>👨‍⚕️ {item.patient?.name || "Unassigned"}</p>

                <p className="mt-2">
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
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={`text-sm italic ${dark ? "text-gray-400" : "text-gray-500"}`}>
          No appointments found
        </p>
      )}
    </div>
  );
}

