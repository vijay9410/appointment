// // "use client";

// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { Toaster, toast } from "react-hot-toast";
// // import {
// //   ArrowLeft,
// //   Search,
// //   Download,
// //   FileText,
// //   Filter,
// //   Eye,
// // } from "lucide-react";
// // import { useRouter } from "next/navigation";

// // export default function UserMedicalRecords() {
// //   const [records, setRecords] = useState([]);
// //   const [filtered, setFiltered] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [dark, setDark] = useState(false);

// //   const [search, setSearch] = useState("");
// //   const [typeFilter, setTypeFilter] = useState("ALL");
// //   const [sortOrder, setSortOrder] = useState("NEWEST");
// //   const [previewUrl, setPreviewUrl] = useState(null);

// //   const router = useRouter();

// //   useEffect(() => {
// //     const token = localStorage.getItem("token");

// //     if (!token) {
// //       toast.error("Please login first!");
// //       router.push("/pages/login");
// //       return;
// //     }

// //     fetchRecords(token);
// //   }, []);

// //   const fetchRecords = async (token) => {
// //     try {
// //       const res = await axios.get("/api/medical-records", {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       setRecords(res.data.records);
// //       setFiltered(res.data.records);
// //     } catch (err) {
// //       toast.error("Failed to fetch medical records");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Filter + sort + search
// //   useEffect(() => {
// //     let temp = [...records];

// //     if (search.trim() !== "") {
// //       temp = temp.filter((r) =>
// //         r.title.toLowerCase().includes(search.toLowerCase())
// //       );
// //     }

// //     if (typeFilter !== "ALL") {
// //       temp = temp.filter((r) => r.type === typeFilter);
// //     }

// //     temp.sort((a, b) =>
// //       sortOrder === "NEWEST"
// //         ? new Date(b.createdAt) - new Date(a.createdAt)
// //         : new Date(a.createdAt) - new Date(b.createdAt)
// //     );

// //     setFiltered(temp);
// //   }, [search, typeFilter, sortOrder, records]);

// //   return (
// //     <div
// //       className={`min-h-screen p-6 transition-all ${
// //         dark ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
// //       }`}
// //     >
// //       <Toaster />

// //       {/* HEADER */}
// //       <div className="flex justify-between items-center mb-6">
// //         <button
// //           className="flex items-center gap-2 text-blue-600 font-medium hover:opacity-80"
// //           onClick={() => router.back()}
// //         >
// //           <ArrowLeft size={20} /> Back
// //         </button>

// //         <h1 className="text-3xl font-extrabold tracking-tight">
// //           Medical Records
// //         </h1>

// //         <button
// //           onClick={() => setDark(!dark)}
// //           className={`px-3 py-1 rounded-lg border ${
// //             dark
// //               ? "bg-gray-800 border-gray-700"
// //               : "bg-white border-gray-300 shadow-sm"
// //           }`}
// //         >
// //           {dark ? "Light" : "Dark"}
// //         </button>
// //       </div>

// //       {/* FILTERS */}
// //       <div className="grid md:grid-cols-4 gap-4 mb-7">
// //         {/* Search */}
// //         <div
// //           className={`flex items-center rounded-xl border px-4 py-2 shadow-sm ${
// //             dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
// //           }`}
// //         >
// //           <Search size={18} className="text-gray-500 mr-2" />
// //           <input
// //             type="text"
// //             placeholder="Search..."
// //             className={`w-full bg-transparent outline-none ${
// //               dark ? "text-gray-200" : "text-gray-700"
// //             }`}
// //             onChange={(e) => setSearch(e.target.value)}
// //           />
// //         </div>

// //         {/* Type Filter */}
// //         <select
// //           className={`rounded-xl px-4 py-2 shadow-sm border ${
// //             dark
// //               ? "bg-gray-800 border-gray-700 text-gray-200"
// //               : "bg-white border-gray-300 text-gray-700"
// //           }`}
// //           onChange={(e) => setTypeFilter(e.target.value)}
// //         >
// //           <option value="ALL">All Types</option>
// //           <option value="Prescription">Prescription</option>
// //           <option value="Lab Report">Lab Report</option>
// //           <option value="Diagnosis">Diagnosis</option>
// //           <option value="Test Report">Test Report</option>
// //         </select>

// //         {/* Sort */}
// //         <select
// //           className={`rounded-xl px-4 py-2 shadow-sm border ${
// //             dark
// //               ? "bg-gray-800 border-gray-700 text-gray-200"
// //               : "bg-white border-gray-300 text-gray-700"
// //           }`}
// //           onChange={(e) => setSortOrder(e.target.value)}
// //         >
// //           <option value="NEWEST">Newest First</option>
// //           <option value="OLDEST">Oldest First</option>
// //         </select>

// //         {/* Count Card */}
// //         <div
// //           className={`rounded-xl px-4 py-2 flex items-center justify-center border shadow-sm font-semibold ${
// //             dark
// //               ? "bg-gray-800 border-gray-700 text-purple-300"
// //               : "bg-white border-gray-300 text-purple-700"
// //           }`}
// //         >
// //           {/* <Filter size={18} className="mr-2" /> {filtered.length} Records */}
// //           <Filter size={18} className="mr-2" /> {Array.isArray(filtered) ? filtered.length : 0} Records

// //         </div>
// //       </div>

// //       {/* RECORDS GRID */}
// //       {loading ? (
// //         <p className="text-gray-500">Loading...</p>
// //       //) : filtered.length === 0 ? (
// //       ) : (!Array.isArray(filtered) || filtered.length === 0) ? (

// //         <p
// //           className={`italic ${
// //             dark ? "text-gray-400" : "text-gray-600"
// //           }`}
// //         >
// //           No medical records found
// //         </p>
// //       ) : (
// //         <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
// //           {
// //           (Array.isArray(filtered) ? filtered : []).map((rec) => (

// //             <div
// //               key={rec.id}
// //               className={`rounded-2xl p-5 border shadow-sm hover:shadow-md transition ${
// //                 dark
// //                   ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
// //                   : "bg-white border-gray-200"
// //               }`}
// //             >
// //               {/* TITLE */}
// //               <div className="flex justify-between items-center">
// //                 <h3 className="font-semibold text-lg">{rec.title}</h3>
// //                 <FileText className="text-purple-600" size={28} />
// //               </div>

// //               <p
// //                 className={`text-sm mt-1 ${
// //                   dark ? "text-gray-400" : "text-gray-600"
// //                 }`}
// //               >
// //                 {rec.type}
// //               </p>

// //               <p
// //                 className={`text-xs mt-2 ${
// //                   dark ? "text-gray-500" : "text-gray-500"
// //                 }`}
// //               >
// //                 {new Date(rec.createdAt).toLocaleDateString()}
// //               </p>

// //               {/* Optional Details */}
// //               {rec.appointment?.title && (
// //                 <p className="text-xs mt-1">
// //                   Appointment:{" "}
// //                   <span className="font-medium">{rec.appointment.title}</span>
// //                 </p>
// //               )}

// //               {rec.patient?.name && (
// //                 <p className="text-xs text-gray-500">
// //                   Patient: {rec.patient.name}
// //                 </p>
// //               )}

// //               {/* Buttons */}
// //               <div className="mt-4 flex items-center gap-3">
// //                 {rec.fileUrl && (
// //                   <button
// //                     onClick={() => setPreviewUrl(rec.fileUrl)}
// //                     className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
// //                   >
// //                     <Eye size={16} /> Preview
// //                   </button>
// //                 )}

// //                 {rec.fileUrl && (
// //                   <a
// //                     href={rec.fileUrl}
// //                     target="_blank"
// //                     download
// //                     className="px-3 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
// //                   >
// //                     <Download size={16} /> Download
// //                   </a>
// //                 )}
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       {/* PREVIEW MODAL */}
// //       {previewUrl && (
// //         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6 z-50">
// //           <div
// //             className={`rounded-xl p-4 w-full max-w-3xl shadow-lg ${
// //               dark ? "bg-gray-900 text-gray-300" : "bg-white"
// //             }`}
// //           >
// //             <div className="flex justify-between items-center mb-3">
// //               <h3 className="font-semibold text-lg">Preview</h3>
// //               <button
// //                 onClick={() => setPreviewUrl(null)}
// //                 className="px-3 py-1 rounded bg-red-500 text-white"
// //               >
// //                 Close
// //               </button>
// //             </div>

// //             {previewUrl.endsWith(".pdf") ? (
// //               <iframe src={previewUrl} className="w-full h-96"></iframe>
// //             ) : (
// //               <img src={previewUrl} className="w-full rounded max-h-96" />
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Toaster, toast } from "react-hot-toast";
// import {
//   ArrowLeft,
//   Search,
//   Download,
//   FileText,
//   Filter,
//   Eye,
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function UserMedicalRecords() {
//   const [records, setRecords] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [dark, setDark] = useState(false);

//   const [search, setSearch] = useState("");
//   const [typeFilter, setTypeFilter] = useState("ALL");
//   const [sortOrder, setSortOrder] = useState("NEWEST");
//   const [previewUrl, setPreviewUrl] = useState(null);

//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       toast.error("Please login first!");
//       router.push("/pages/login");
//       return;
//     }

//     fetchRecords(token);
//   }, []);

//   const fetchRecords = async (token) => {
//     try {
//       const res = await axios.get("/api/medical-records", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = Array.isArray(res.data.records) ? res.data.records : [];
//       setRecords(data);
//       setFiltered(data);
//     } catch (err) {
//       toast.error("Failed to fetch medical records");
//       setRecords([]);
//       setFiltered([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // SAFE FILTER, SORT, SEARCH
//   useEffect(() => {
//     if (!Array.isArray(records)) return;

//     let temp = [...records];

//     if (search.trim()) {
//       temp = temp.filter((r) =>
//         r.title.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (typeFilter !== "ALL") {
//       temp = temp.filter((r) => r.type === typeFilter);
//     }

//     temp.sort((a, b) =>
//       sortOrder === "NEWEST"
//         ? new Date(b.createdAt) - new Date(a.createdAt)
//         : new Date(a.createdAt) - new Date(b.createdAt)
//     );

//     setFiltered(temp);
//   }, [search, typeFilter, sortOrder, records]);

//   return (
//     <div
//       className={`min-h-screen p-6 transition-all ${
//         dark ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
//       }`}
//     >
//       <Toaster />

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <button
//           className="flex items-center gap-2 text-blue-600 font-medium hover:opacity-80"
//           onClick={() => router.back()}
//         >
//           <ArrowLeft size={20} /> Back
//         </button>

//         <h1 className="text-3xl font-extrabold tracking-tight">
//           Medical Records
//         </h1>

//         <button
//           onClick={() => setDark(!dark)}
//           className={`px-3 py-1 rounded-lg border ${
//             dark
//               ? "bg-gray-800 border-gray-700"
//               : "bg-white border-gray-300 shadow-sm"
//           }`}
//         >
//           {dark ? "Light" : "Dark"}
//         </button>
//       </div>

//       {/* FILTERS */}
//       <div className="grid md:grid-cols-4 gap-4 mb-7">
//         {/* Search */}
//         <div
//           className={`flex items-center rounded-xl border px-4 py-2 shadow-sm ${
//             dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
//           }`}
//         >
//           <Search size={18} className="text-gray-500 mr-2" />
//           <input
//             type="text"
//             placeholder="Search..."
//             className={`w-full bg-transparent outline-none ${
//               dark ? "text-gray-200" : "text-gray-700"
//             }`}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         {/* Type Filter */}
//         <select
//           className={`rounded-xl px-4 py-2 shadow-sm border ${
//             dark
//               ? "bg-gray-800 border-gray-700 text-gray-200"
//               : "bg-white border-gray-300 text-gray-700"
//           }`}
//           onChange={(e) => setTypeFilter(e.target.value)}
//         >
//           <option value="ALL">All Types</option>
//           <option value="Prescription">Prescription</option>
//           <option value="Lab Report">Lab Report</option>
//           <option value="Diagnosis">Diagnosis</option>
//           <option value="Test Report">Test Report</option>
//         </select>

//         {/* Sort */}
//         <select
//           className={`rounded-xl px-4 py-2 shadow-sm border ${
//             dark
//               ? "bg-gray-800 border-gray-700 text-gray-200"
//               : "bg-white border-gray-300 text-gray-700"
//           }`}
//           onChange={(e) => setSortOrder(e.target.value)}
//         >
//           <option value="NEWEST">Newest First</option>
//           <option value="OLDEST">Oldest First</option>
//         </select>

//         {/* Count Card SAFE */}
//         <div
//           className={`rounded-xl px-4 py-2 flex items-center justify-center border shadow-sm font-semibold ${
//             dark
//               ? "bg-gray-800 border-gray-700 text-purple-300"
//               : "bg-white border-gray-300 text-purple-700"
//           }`}
//         >
//           <Filter size={18} className="mr-2" />{" "}
//           {Array.isArray(filtered) ? filtered.length : 0} Records
//         </div>
//       </div>

//       {/* RECORDS GRID */}
//       {loading ? (
//         <p className="text-gray-500">Loading...</p>
//       ) : !Array.isArray(filtered) || filtered.length === 0 ? (
//         <p className={`italic ${dark ? "text-gray-400" : "text-gray-600"}`}>
//           No medical records found
//         </p>
//       ) : (
//         <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
//           {(Array.isArray(filtered) ? filtered : []).map((rec) => (
//             <div
//               key={rec.id}
//               className={`rounded-2xl p-5 border shadow-sm hover:shadow-md transition ${
//                 dark
//                   ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
//                   : "bg-white border-gray-200"
//               }`}
//             >
//               {/* TITLE */}
//               <div className="flex justify-between items-center">
//                 <h3 className="font-semibold text-lg">{rec.title}</h3>
//                 <FileText className="text-purple-600" size={28} />
//               </div>

//               <p
//                 className={`text-sm mt-1 ${
//                   dark ? "text-gray-400" : "text-gray-600"
//                 }`}
//               >
//                 {rec.type}
//               </p>

//               <p
//                 className={`text-xs mt-2 ${
//                   dark ? "text-gray-500" : "text-gray-500"
//                 }`}
//               >
//                 {new Date(rec.createdAt).toLocaleDateString()}
//               </p>

//               {rec.appointment?.title && (
//                 <p className="text-xs mt-1">
//                   Appointment:{" "}
//                   <span className="font-medium">{rec.appointment.title}</span>
//                 </p>
//               )}

//               {rec.patient?.name && (
//                 <p className="text-xs text-gray-500">
//                   Patient: {rec.patient.name}
//                 </p>
//               )}

//               {/* Buttons */}
//               <div className="mt-4 flex items-center gap-3">
//                 {rec.fileUrl && (
//                   <button
//                     onClick={() => setPreviewUrl(rec.fileUrl)}
//                     className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
//                   >
//                     <Eye size={16} /> Preview
//                   </button>
//                 )}

//                 {rec.fileUrl && (
//                   <a
//                     href={rec.fileUrl}
//                     target="_blank"
//                     download
//                     className="px-3 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
//                   >
//                     <Download size={16} /> Download
//                   </a>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* PREVIEW MODAL */}
//       {previewUrl && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6 z-50">
//           <div
//             className={`rounded-xl p-4 w-full max-w-3xl shadow-lg ${
//               dark ? "bg-gray-900 text-gray-300" : "bg-white"
//             }`}
//           >
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="font-semibold text-lg">Preview</h3>
//               <button
//                 onClick={() => setPreviewUrl(null)}
//                 className="px-3 py-1 rounded bg-red-500 text-white"
//               >
//                 Close
//               </button>
//             </div>

//             {previewUrl.endsWith(".pdf") ? (
//               <iframe src={previewUrl} className="w-full h-96"></iframe>
//             ) : (
//               <img src={previewUrl} className="w-full rounded max-h-96" />
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import {
  ArrowLeft,
  Search,
  Download,
  FileText,
  Filter,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserMedicalRecords() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NEWEST");
  const [previewUrl, setPreviewUrl] = useState(null);

  const router = useRouter();

  // ---------------------------
  // 1. Fetch Patients FIRST
  // ---------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first!");
      router.push("/pages/login");
      return;
    }
    fetchPatients(token);
  }, []);

  // const fetchPatients = async (token) => {
  //   try {
  //     const res = await axios.get("/api/patients", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (Array.isArray(res.data)) {
  //       setPatients(res.data);
  //       setSelectedPatient(res.data[0]?.id || null); // auto-select first patient
  //     }
  //   } catch (err) {
  //     toast.error("Failed to load patients");
  //   }
  // };

  const fetchPatients = async (token) => {
  try {
    const res = await axios.get("/api/patients", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const list = res.data.patients;

    if (Array.isArray(list)) {
      setPatients(list);
      setSelectedPatient(list[0]?.id || null); // auto-select first
    } else {
      setPatients([]);
    }
  } catch (err) {
    toast.error("Failed to load patients");
    setPatients([]);
  }
};


  // ---------------------------
  // 2. Fetch Medical Records when Patient Changes
  // ---------------------------
  useEffect(() => {
    if (!selectedPatient) return;
    const token = localStorage.getItem("token");
    fetchRecords(token, selectedPatient);
  }, [selectedPatient]);

  const fetchRecords = async (token, patientId) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `/api/medical-records?patientId=${patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = Array.isArray(res.data.records) ? res.data.records : [];

      setRecords(data);
      setFiltered(data);
    } catch (err) {
      toast.error("Failed to fetch medical records");
      setRecords([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // FILTER + SORT + SEARCH
  // ---------------------------
  useEffect(() => {
    if (!Array.isArray(records)) return;

    let temp = [...records];

    if (search.trim()) {
      temp = temp.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "ALL") {
      temp = temp.filter((r) => r.type === typeFilter);
    }

    temp.sort((a, b) =>
      sortOrder === "NEWEST"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    setFiltered(temp);
  }, [search, typeFilter, sortOrder, records]);

  return (
    <div
      className={`min-h-screen p-6 transition-all ${
        dark ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
      }`}
    >
      <Toaster />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="flex items-center gap-2 text-blue-600 font-medium hover:opacity-80"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} /> Back
        </button>

        <h1 className="text-3xl font-extrabold tracking-tight">
          Medical Records
        </h1>

        <button
          onClick={() => setDark(!dark)}
          className={`px-3 py-1 rounded-lg border ${
            dark
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-300 shadow-sm"
          }`}
        >
          {dark ? "Light" : "Dark"}
        </button>
      </div>

      {/* PATIENT SELECTOR (NEW) */}
      <div className="mb-6">
        <label className="font-semibold block mb-2">Select Patient</label>

        <select
          className={`rounded-xl px-4 py-2 shadow-sm border ${
            dark
              ? "bg-gray-800 border-gray-700 text-gray-200"
              : "bg-white border-gray-300 text-gray-700"
          }`}
          value={selectedPatient || ""}
          onChange={(e) => setSelectedPatient(Number(e.target.value))}
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* EXISTING FILTER UI — UNCHANGED */}
      <div className="grid md:grid-cols-4 gap-4 mb-7">
        <div
          className={`flex items-center rounded-xl border px-4 py-2 shadow-sm ${
            dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
          }`}
        >
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className={`w-full bg-transparent outline-none ${
              dark ? "text-gray-200" : "text-gray-700"
            }`}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className={`rounded-xl px-4 py-2 shadow-sm border ${
            dark
              ? "bg-gray-800 border-gray-700 text-gray-200"
              : "bg-white border-gray-300 text-gray-700"
          }`}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">All Types</option>
          <option value="Prescription">Prescription</option>
          <option value="Lab Report">Lab Report</option>
          <option value="Diagnosis">Diagnosis</option>
          <option value="Test Report">Test Report</option>
        </select>

        <select
          className={`rounded-xl px-4 py-2 shadow-sm border ${
            dark
              ? "bg-gray-800 border-gray-700 text-gray-200"
              : "bg-white border-gray-300 text-gray-700"
          }`}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="NEWEST">Newest First</option>
          <option value="OLDEST">Oldest First</option>
        </select>

        <div
          className={`rounded-xl px-4 py-2 flex items-center justify-center border shadow-sm font-semibold ${
            dark
              ? "bg-gray-800 border-gray-700 text-purple-300"
              : "bg-white border-gray-300 text-purple-700"
          }`}
        >
          <Filter size={18} className="mr-2" />{" "}
          {Array.isArray(filtered) ? filtered.length : 0} Records
        </div>
      </div>

      {/* RECORD LIST (UNCHANGED) */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : !Array.isArray(filtered) || filtered.length === 0 ? (
        <p className={`italic ${dark ? "text-gray-400" : "text-gray-600"}`}>
          No medical records found
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((rec) => (
            <div
              key={rec.id}
              className={`rounded-2xl p-5 border shadow-sm hover:shadow-md transition ${
                dark
                  ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{rec.title}</h3>
                <FileText className="text-purple-600" size={28} />
              </div>

              <p
                className={`text-sm mt-1 ${
                  dark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {rec.type}
              </p>

              <p className={`text-xs mt-2 text-gray-500`}>
                {new Date(rec.createdAt).toLocaleDateString()}
              </p>

              {rec.appointment?.title && (
                <p className="text-xs mt-1">
                  Appointment:{" "}
                  <span className="font-medium">{rec.appointment.title}</span>
                </p>
              )}

              {rec.patient?.name && (
                <p className="text-xs text-gray-500">
                  Patient: {rec.patient.name}
                </p>
              )}

              {/* <div className="mt-4 flex items-center gap-3">
                {rec.fileUrl && (
                  <button
                    onClick={() => setPreviewUrl(rec.fileUrl)}
                    className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    <Eye size={16} /> Preview
                  </button>
                )} */}
                <div className="mt-4 flex items-center gap-3 flex-wrap">
          {/* NEW – Detail Page */}
          <button
            onClick={() => router.push(`/pages/UserMedicalRecords/${rec.id}`)}
            className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200"
          >
            View Details
          </button>

          {/* EXISTING – Preview */}
          {rec.fileUrl && (
            <button
              onClick={() => setPreviewUrl(rec.fileUrl)}
              className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              <Eye size={16} /> Preview
            </button>
          )}

          {/* EXISTING – Download */}
          {rec.fileUrl && (
            <a
              href={rec.fileUrl}
              target="_blank"
              download
              className="px-3 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
            >
              <Download size={16} /> Download
            </a>
          )}
        </div>

                {/* {rec.fileUrl && (
                  <a
                    href={rec.fileUrl}
                    target="_blank"
                    download
                    className="px-3 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                  >
                    <Download size={16} /> Download
                  </a>
                )}
              </div> */}
            </div>
          ))}
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6 z-50">
          <div
            className={`rounded-xl p-4 w-full max-w-3xl shadow-lg ${
              dark ? "bg-gray-900 text-gray-300" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">Preview</h3>
              <button
                onClick={() => setPreviewUrl(null)}
                className="px-3 py-1 rounded bg-red-500 text-white"
              >
                Close
              </button>
            </div>

            {previewUrl.endsWith(".pdf") ? (
              <iframe src={previewUrl} className="w-full h-96"></iframe>
            ) : (
              <img src={previewUrl} className="w-full rounded max-h-96" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
