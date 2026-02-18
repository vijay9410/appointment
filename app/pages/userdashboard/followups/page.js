"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, CalendarClock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FollowUps() {
  const [loading, setLoading] = useState(true);
  const [followUps, setFollowUps] = useState([]);
  const [dark, setDark] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first!");
      router.push("/pages/login");
      return;
    }

    fetchFollowUps(token);
  }, []);

  const fetchFollowUps = async (token) => {
    try {
      const res = await axios.get("/api/followups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowUps(res.data.followUps || []);
    } catch {
      toast.error("Failed to load follow-up reminders");
    } finally {
      setLoading(false);
    }
  };

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
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:opacity-80"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarClock size={24} className="text-purple-500" />
          Follow-up Reminders
        </h1>

        <button
          onClick={() => setDark(!dark)}
          className="px-3 py-1 rounded-lg border"
        >
          {dark ? "Light" : "Dark"}
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : followUps.length === 0 ? (
        <p className="italic text-gray-500">No follow-up reminders found.</p>
      ) : (
        <div className="space-y-5">
          {followUps.map((f) => (
            <div
              key={f.id}
              className={`rounded-2xl p-5 border shadow-sm hover:shadow-md transition ${
                dark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <h2 className="text-lg font-semibold">
                {f.title || "Appointment"}
              </h2>

              <p className="text-sm mt-2 text-gray-500">
                Doctor: <span className="font-medium">{f.doctor?.name}</span>
              </p>

              <p className="text-sm mt-1 text-gray-500">
                Patient: <span className="font-medium">{f.patient?.name}</span>
              </p>

              <p className="text-sm mt-3 font-semibold text-purple-600">
                Follow-up Date:{" "}
                {new Date(f.followUpDate).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
