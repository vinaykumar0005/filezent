import { useState } from "react";
import api from "../api/axios";
import Popup from "../components/Popup";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit login
  const submit = async () => {
    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      // Save auth data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/upload");

      // Redirect
      // window.location.href = "/dashboard";
    } catch (err) {
      setError(
        "You entered wrong credentials. Please enter correct credentials.",err
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center rounded-2xl px-4">

      <div className="w-full max-w-md">

        {/* Logo / Header */}
        <div className="text-center mb-8 pt-4 ">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg mb-4">
            🔐
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>

          <p className="text-gray-600 mt-2">
            Login to continue to Filezent
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">

          <div className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  📧
                </span>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  🔒
                </span>

                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                />
              </div>
            </div>

            {/* Forgot */}
            <div className="flex justify-end">
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-purple-600 font-medium transition"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">

                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4z"
                    />
                  </svg>

                  Logging in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Register */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Don’t have an account?{" "}
                <a
                  href="/register"
                  className="text-blue-600 hover:text-purple-600 font-semibold transition"
                >
                  Create Account
                </a>
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Secure file sharing platform
        </p>

      </div>

      {/* Error Popup */}
      {error && (
        <Popup
          message={error}
          onClose={() => setError("")}
        />
      )}
    </div>
  );
}

//old code
// import { useState } from "react";
// import api from "../api/axios";
// import Popup from "../components/Popup";

// export default function Login() {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const submit = async () => {
//     if (!form.email || !form.password) {
//       setError("Please enter email and password.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await api.post("/auth/login", form);

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       window.location.href = "/dashboard";
//     // eslint-disable-next-line no-unused-vars
//     } catch (err) {
//       setError(
//         "You entered wrong credentials. Please enter correct credentials."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* LOGIN FORM */}
//       {/* <div className="space-y-3"> */}
//       <div className="min-h-64 space-y-4 text-center rounded-md">
//         <h2 className="text-2xl font-bold mb-4">
//           Login
//         </h2>


//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           className="input"
//           onChange={handleChange}
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           className="input"
//           onChange={handleChange}
//         />

//         <button
//           onClick={submit}
//           disabled={loading}
//           className="btn mt-2 w-full"

//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         <div className="text-center text-sm mt-3">
//           <a
//             href="/forgot-password"
//             className="text-black underline"
//           >
//             Forgot password?
//           </a>
//         </div>
//       </div>

//       {/* ✅ THIS USES `error`, SO WARNING DISAPPEARS */}
//       {error && ( 
//         <Popup
//           message={error}
//           onClose={() => setError("")}
//         />
//       )}
//     </>
//   );
// }
