// "use client";
// import { useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

// const SignupSchema = Yup.object().shape({
//   name: Yup.string().required("Name required"),
//   email: Yup.string().email("Invalid email").required("Email required"),
//   password: Yup.string().min(6, "Min 6 chars").required("Password required"),
//   role: Yup.string().oneOf(["ADMIN", "USER"]).required("Role required"),
// });

// export default function SignupPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (values) => {
//     try {
//       setLoading(true);
//       const res = await axios.post("/api/auth/signup", values);
//       toast.success("Signup successful!");
//       router.push("/pages/login");
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white shadow-lg rounded-2xl p-6 w-96">
//         <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>

//         <Formik
//           initialValues={{ name: "", email: "", password: "", role: "USER" }}
//           validationSchema={SignupSchema}
//           onSubmit={handleSubmit}
//         >
//           {() => (
//             <Form className="flex flex-col gap-3">
//               <div>
//                 <Field name="name" placeholder="Full Name" className="input" />
//                 <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
//               </div>

//               <div>
//                 <Field name="email" placeholder="Email" type="email" className="input" />
//                 <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
//               </div>

//               <div>
//                 <Field name="password" placeholder="Password" type="password" className="input" />
//                 <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
//               </div>

//               <div>
//                 <Field as="select" name="role" className="input">
//                   <option value="USER">User</option>
//                   <option value="ADMIN">Admin</option>
//                 </Field>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700"
//               >
//                 {loading ? "Creating..." : "Signup"}
//               </button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().min(6, "Min 6 chars").required("Password required"),
  role: Yup.string().oneOf(["ADMIN", "USER","DOCTOR"]).required("Role required"),
});

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/signup", values);
      toast.success("Signup successful!");
      router.push("/pages/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Create Account</h2>

        <Formik
          initialValues={{ name: "", email: "", password: "", role: "USER" }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="flex flex-col gap-3">
              {/* Full Name */}
              <div>
                <Field
                  name="name"
                  placeholder="Full Name"
                  className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Email */}
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

              {/* Password */}
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

              {/* Role */}
              <div>
                <Field
                  as="select"
                  name="role"
                  className="w-full p-2 border border-gray-300 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USER">User</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="ADMIN">Admin</option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white rounded-md py-2 transition-colors duration-200`}
              >
                {loading ? "Creating..." : "Signup"}
              </button>

            </Form>
          )}
        </Formik>
      </div>

      {/* Toasts */}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
