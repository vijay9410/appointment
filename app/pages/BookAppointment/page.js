
"use client";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const AppointmentSchema = Yup.object().shape({
  title: Yup.string().required("Title required"),
  doctorId: Yup.string().required("Select doctor"),
  patientId: Yup.string().required("Select patient"),
  date: Yup.string().required("Select date"),
  time: Yup.string().required("Select time"),
  notes: Yup.string().max(200, "Max 200 characters"),
});

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const getCurrentTime = () => {
    const now = new Date();
    const minutes = Math.ceil(now.getMinutes() / 5) * 5; // round to 5 min
    now.setMinutes(minutes);
    return now.toTimeString().slice(0, 5); // "HH:mm"
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first!");
      router.push("/pages/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [doctorsRes, patientsRes] = await Promise.all([
          axios.get("/api/doctors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/patients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDoctors(doctorsRes.data.doctors || []);
        setPatients(patientsRes.data.patients || []);
        
      } catch (error) {
        console.error(error);
        toast.error("Failed to load doctors/patients");
      }
    };

    fetchData();
  }, [router]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // ✅ Combine date + time correctly
      const isoDateTime = new Date(`${values.date}T${values.time}:00`);

      const payload = {
        title: values.title,
        doctorId: parseInt(values.doctorId),
        patientId: parseInt(values.patientId),
        date: isoDateTime.toISOString(), // send ISO datetime
        notes: values.notes,
      };

      await axios.post("/api/bookappointment/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Appointment booked successfully!");
      setTimeout(() => router.push("/pages/userdashboard"), 1000);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.error || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          Book Appointment
        </h2>

        <Formik
          initialValues={{
            title: "",
            doctorId: "",
            patientId: "",
            date: today,
            time: getCurrentTime(),
            notes: "",
          }}
          validationSchema={AppointmentSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="flex flex-col gap-4">
              {/* Title */}
              <div>
                <Field
                  name="title"
                  placeholder="Appointment Title"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-green-500"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Doctor Dropdown */}
              <div>
                <Field
                  as="select"
                  name="doctorId"
                  className="w-full p-2 border border-gray-300 rounded-md text-black bg-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="doctorId"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Patient Dropdown */}
              <div>
                <Field
                  as="select"
                  name="patientId"
                  className="w-full p-2 border border-gray-300 rounded-md text-black bg-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="patientId"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Date */}
              <div>
                <Field name="date">
                {({ field, form }) => (
                  <input
                    type="date"
                    {...field}
                    min={today}   // ❌ past date block
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                    onChange={(e) => {
                      const selected = e.target.value;
                      const day = new Date(selected).getDay();

                      if (day === 0 || day === 6) {
                        toast.error("Weekend appointments not allowed");
                        return;
                      }

                      form.setFieldValue("date", selected);
                    }}
                  />
                )}
              </Field>

                <ErrorMessage
                  name="date"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Time */}
              <div>
                <Field
                  type="time"
                  name="time"
                  step="300" // 5 min steps
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />

                <ErrorMessage
                  name="time"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Notes */}
              <div>
                <Field
                  as="textarea"
                  name="notes"
                  placeholder="Notes (optional)"
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white rounded-md py-2 transition-colors duration-200`}
              >
                {loading ? "Booking..." : "Book Appointment"}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <Toaster position="top-center" />
    </div>
  );
}
