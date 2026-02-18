"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";

export default function EditAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [form, setForm] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios.get(`/api/admin/appointments/${id}`).then((res) => setForm(res.data));
    axios.get("/api/admin/doctors").then((res) => setDoctors(res.data));
    axios.get("/api/admin/patients").then((res) => setPatients(res.data));
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.patch(`/api/admin/appointments/${id}`, form);
      toast.success("Updated");
      router.push("/pages/admin/appointments");
    } catch {
      toast.error("Update failed");
    }
  };

  if (!form) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Appointment</h1>

      <input
        className="border p-2 w-full mb-3"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <select
        className="border p-2 w-full mb-3"
        value={form.doctorId}
        onChange={(e) =>
          setForm({ ...form, doctorId: Number(e.target.value) })
        }
      >
        {doctors.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <select
        className="border p-2 w-full mb-3"
        value={form.patientId}
        onChange={(e) =>
          setForm({ ...form, patientId: Number(e.target.value) })
        }
      >
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        className="border p-2 w-full mb-3"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      <input
        type="time"
        className="border p-2 w-full mb-3"
        value={form.time}
        onChange={(e) => setForm({ ...form, time: e.target.value })}
      />

      <select
        className="border p-2 w-full mb-3"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="scheduled">Scheduled</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <button
        className="bg-blue-600 text-white p-2 rounded w-full"
        onClick={handleUpdate}
      >
        Update
      </button>
    </div>
  );
}
