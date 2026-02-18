// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import {
//   BarChart3,
//   CalendarCheck2,
//   CalendarClock,
//   CalendarX,
//   Moon,
//   Sun,
//   LogOut,
// } from "lucide-react"; // 🧩 icon pack

// export default function Dashboard() {
//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);
//   const router = useRouter();

//   // ✅ Fetch dashboard data
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please login first!");
//       router.push("/");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const res = await axios.get("/api/admin", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setDashboardData(res.data);
//       } catch (err) {
//         toast.error(err.response?.data?.error || "Access denied");
//         router.push("/");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [router]);

//   // ✅ Logout handler
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     toast.success("Logged out successfully!");
//     router.push("/pages/login");
//   };

//   // ✅ Toggle dark mode
//   const toggleTheme = () => setDarkMode(!darkMode);

//   if (loading) {
//     return (
//       <div
//         className={`flex items-center justify-center min-h-screen ${
//           darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-700"
//         }`}
//       >
//         <div className="flex flex-col items-center space-y-3">
//           <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
//           <p className="font-medium">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   const summary = dashboardData?.summary || {
//     total: 0,
//     past: 0,
//     current: 0,
//     upcoming: 0,
//   };
//   const data = dashboardData?.data || {
//     past: [],
//     current: [],
//     upcoming: [],
//   };
//   const message = dashboardData?.message || "Welcome Admin";

//   return (
//     <div
//       className={`min-h-screen transition-all duration-500 ${
//         darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
//       }`}
//     >
//       {/* Header */}
//       <header
//         className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b ${
//           darkMode ? "border-gray-800 bg-gray-950" : "bg-white shadow-sm"
//         }`}
//       >
//         <div>
//           <h1 className="text-3xl font-extrabold flex items-center gap-2">
//             <BarChart3 size={26} /> Admin Dashboard
//           </h1>
//           <p className="text-gray-500 mt-1">{message}</p>
//         </div>

//         <div className="flex items-center gap-3 mt-4 md:mt-0">
//           {/* Theme Toggle */}
//           <button
//             onClick={toggleTheme}
//             className={`p-2 rounded-full border transition-all ${
//               darkMode
//                 ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
//                 : "bg-gray-100 hover:bg-gray-200 border-gray-300"
//             }`}
//           >
//             {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//           </button>

//           {/* Logout */}
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all shadow-sm"
//           >
//             <LogOut size={16} /> Logout
//           </button>
//         </div>
//       </header>

//       {/* Summary Cards */}
//       <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6">
//         <SummaryCard
//           icon={<BarChart3 className="text-blue-600" />}
//           title="Total Appointments"
//           value={summary.total}
//           color="blue"
//           dark={darkMode}
//         />
//         <SummaryCard
//           icon={<CalendarCheck2 className="text-green-600" />}
//           title="Today's Appointments"
//           value={summary.current}
//           color="green"
//           dark={darkMode}
//         />
//         <SummaryCard
//           icon={<CalendarClock className="text-yellow-600" />}
//           title="Upcoming"
//           value={summary.upcoming}
//           color="yellow"
//           dark={darkMode}
//         />
//         <SummaryCard
//           icon={<CalendarX className="text-red-600" />}
//           title="Past"
//           value={summary.past}
//           color="red"
//           dark={darkMode}
//         />
//       </section>

//       {/* Appointment Lists */}
//       <main className="p-6 grid md:grid-cols-3 gap-6">
//         <AppointmentCard
//           title="Today's Appointments"
//           list={data.current}
//           accent="blue"
//           dark={darkMode}
//         />
//         <AppointmentCard
//           title="Upcoming Appointments"
//           list={data.upcoming}
//           accent="green"
//           dark={darkMode}
//         />
//         <AppointmentCard
//           title="Past Appointments"
//           list={data.past}
//           accent="gray"
//           dark={darkMode}
//         />
//       </main>

//       <Toaster position="top-center" />
//     </div>
//   );
// }

// function SummaryCard({ icon, title, value, color, dark }) {
//   return (
//     <div
//       className={`rounded-xl p-4 flex items-center gap-4 border transition-all duration-300 hover:scale-[1.02] ${
//         dark
//           ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
//           : "bg-white border-gray-200 shadow-sm hover:shadow-md"
//       }`}
//     >
//       {/* Icon */}
//       <div className="text-3xl">{icon}</div>

//       {/* Text */}
//       <div>
//         <p className="text-sm text-gray-500">{title}</p>
//         <h3
//           className={`text-2xl font-bold ${
//             dark ? "text-white" : "text-black"
//           }`}
//         >
//           {value}
//         </h3>
//       </div>
//     </div>
//   );
// }


// function AppointmentCard({ title, list, accent, dark }) {
//   return (
//     <div
//       className={`rounded-2xl p-5 border transition-all duration-300 ${
//         dark
//           ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
//           : "bg-white border-gray-200 shadow-sm hover:shadow-lg"
//       }`}
//     >
//       <h2
//         className={`text-lg font-semibold mb-4 border-b-2 pb-2 ${
//           accent === "blue"
//             ? "border-blue-300 text-blue-700 dark:text-blue-400"
//             : accent === "green"
//             ? "border-green-300 text-green-700 dark:text-green-400"
//             : "border-gray-300 text-gray-700 dark:text-gray-300"
//         }`}
//       >
//         {title}
//       </h2>

//       {Array.isArray(list) && list.length > 0 ? (
//         <div className="space-y-4">
//           {list.map((item) => (
//             <div
//               key={item.id}
//               className={`rounded-xl p-4 border transition-all duration-200 ${
//                 dark
//                   ? "bg-gray-900 border-gray-700 hover:bg-gray-800"
//                   : "bg-gray-50 border-gray-200 hover:bg-gray-100"
//               }`}
//             >
//               {/* Appointment Title */}
//               <h3
//                 className={`font-semibold ${
//                   dark ? "text-white" : "text-gray-800"
//                 }`}
//               >
//                 {item.title || "Untitled Appointment"}
//               </h3>

//               {/* Appointment Details */}
//               <div
//                 className={`mt-2 space-y-1 text-sm ${
//                   dark ? "text-gray-300" : "text-gray-600"
//                 }`}
//               >
//                 <p>📅 {item.date ? new Date(item.date).toLocaleString() : "N/A"}</p>
//                 <p>
//                   👤 {item.patient?.name || "Unknown"} (
//                   {item.patient?.phone || "—"})
//                 </p>
//                 <p>
//                   🧑‍⚕️ {item.user?.name || "Unknown"} ({item.user?.role || "N/A"})
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p
//           className={`text-sm italic ${
//             dark ? "text-gray-400" : "text-gray-500"
//           }`}
//         >
//           No appointments found
//         </p>
//       )}
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  CalendarCheck2,
  CalendarClock,
  CalendarX,
  Moon,
  Sun,
  LogOut,
  Users,
  UserCog,
  Stethoscope,
} from "lucide-react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Fetch data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      toast.error("Please login first!");
      router.push("/pages/login");
      return;
    }

    if (role !== "ADMIN") {
      toast.error("Unauthorized access!");
      router.push("/pages/dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get("/api/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(res.data);
      } catch (err) {
        toast.error("Access denied");
        router.push("/pages/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully!");
    router.push("/pages/login");
  };

  // Theme toggle
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

  const summary = dashboardData?.summary || {
    total: 0,
    past: 0,
    current: 0,
    upcoming: 0,
    doctors: 0,
    users: 0,
  };
  const data = dashboardData?.data || {
    past: [],
    current: [],
    upcoming: [],
  };

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
          <BarChart3
            size={32}
            className={darkMode ? "text-blue-400" : "text-blue-600"}
          />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Clinic Overview & Controls</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
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

      {/* Summary Cards */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6">
        <SummaryCard
          icon={<Users className="text-blue-600" />}
          title="Total Patients"
          value={summary.totalPatients}
          accent="blue"
          dark={darkMode}
        />
        <SummaryCard
          icon={<Stethoscope className="text-purple-600" />}
          title="Total Doctors"
          value={summary.totalDoctors}
          accent="purple"
          dark={darkMode}
        />
        <SummaryCard
          icon={<CalendarCheck2 className="text-green-600" />}
          title="Today’s Appointments"
          value={summary.current}
          accent="green"
          dark={darkMode}
        />
        <SummaryCard
          icon={<CalendarX className="text-red-600" />}
          title="Past Appointments"
          value={summary.past}
          accent="red"
          dark={darkMode}
        />
      </section>

      {/* Quick Actions */}
      <div className="mt-10 px-6">
        <h2
          className={`text-xl font-bold mb-5 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              title: "Manage Doctors",
              iconBg: "bg-purple-100",
              iconColor: "text-purple-600",
              route: "/pages/admin/doctors",
            },
            {
              title: "Manage Patients",
              iconBg: "bg-blue-100",
              iconColor: "text-blue-600",
              route: "/pages/admin/patients",
            },
            {
              title: "All Appointments",
              iconBg: "bg-green-100",
              iconColor: "text-green-600",
              route: "/pages/admin/appointments",
            },
            {
              title: "Clinic Settings",
              iconBg: "bg-yellow-100",
              iconColor: "text-yellow-600",
              route: "/pages/admin/settings",
            },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => router.push(item.route)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all shadow-sm flex flex-col items-center text-center hover:shadow-md hover:scale-[1.02] ${
                darkMode
                  ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className={`${item.iconBg} p-4 rounded-full mb-3`}>
                <UserCog
                  size={28}
                  className={item.iconColor}
                />
              </div>
              <p
                className={`font-semibold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Lists */}
      <main id="appointmentsSection" className="p-6 grid md:grid-cols-3 gap-6">
        <AppointmentCard
          title="Today's Appointments"
          list={data.current}
          accent="blue"
          dark={darkMode}
        />
        <AppointmentCard
          title="Upcoming Appointments"
          list={data.upcoming}
          accent="green"
          dark={darkMode}
        />
        <AppointmentCard
          title="Past Appointments"
          list={data.past}
          accent="gray"
          dark={darkMode}
        />
      </main>

      <Toaster position="top-center" />
    </div>
  );
}

/* ---------------- SummaryCard ---------------- */
function SummaryCard({ icon, title, value, accent, dark }) {
  const colorMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    purple: "text-purple-600",
    yellow: "text-yellow-600",
  };

  return (
    <div
      className={`rounded-xl p-4 flex items-center gap-4 border transition-all duration-300 hover:scale-[1.02] ${
        dark
          ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
          : "bg-white shadow-sm hover:shadow-md border-gray-200"
      }`}
    >
      <div className={`text-3xl ${colorMap[accent]}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className={`text-2xl font-bold ${dark ? "text-white" : "text-black"}`}>
          {value}
        </h3>
      </div>
    </div>
  );
}

/* ---------------- AppointmentCard ---------------- */
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
            ? "border-blue-300 text-blue-700 dark:text-blue-400"
            : accent === "green"
            ? "border-green-300 text-green-700 dark:text-green-400"
            : "border-gray-300 text-gray-700 dark:text-gray-300"
        }`}
      >
        {title}
      </h2>

      {list?.length > 0 ? (
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
                <p>📅 {new Date(item.date).toLocaleString()}</p>
                <p>👤 {item.patient?.name || "Unknown"} ({item.patient?.phone})</p>
                <p>🧑‍⚕️ {item.user?.name || "Doctor"}</p>
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
