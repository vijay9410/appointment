"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

// ✅ Validation Schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().required("Password required"),
});

export default function LoginPage() {
  const router = useRouter();

  // ✅ Handle form submit
  const handleSubmit = async (values) => {
    try {
      const res = await axios.post("/api/auth/login", values);

      console.log(values);

      // Save token + role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      // Show success toast
      toast.success("Login successful!");

      // Redirect based on role
      if (res.data.user.role === "ADMIN") {
        router.push("/pages/dashboard");
      }else if (res.data.user.role === "DOCTOR")
      {
        localStorage.setItem("doctorId", res.data.user.id); 
        router.push("/pages/doctordashboard");
      }
       else {
        router.push("/pages/userdashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          Login
        </h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="flex flex-col gap-3">
              {/* Email Field */}
              <div>
                <Field
                  name="email"
                  placeholder="Email"
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password Field */}
              <div>
                <Field
                  name="password"
                  placeholder="Password"
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-green-600 text-white rounded-md py-2 hover:bg-green-700 transition-colors duration-200"
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* ✅ Toaster for toast messages */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
      />
    </div>
  );
}
