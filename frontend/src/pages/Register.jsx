import { useState } from "react";
import api from "../api/axios";
import Popup from "../components/Popup";

export default function Register() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [popup, setPopup] = useState("");
  const [loading, setLoading] = useState(false);

  /* ======================
     SEND OTP
  ====================== */
  const sendOtp = async () => {
    if (!form.name || !form.email || !form.password) {
      setPopup("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register/send-otp", {
        email: form.email,
      });

      setStep(2);
    } catch (err) {
      setPopup(
        err.response?.data?.message ||
          "OTP send failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     VERIFY & REGISTER
  ====================== */
  const verifyOtp = async () => {
    if (!otp) {
      setPopup("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register/verify-otp", {
        ...form,
        otp,
      });

      setPopup("Registration successful. Please login.");
      setStep(3);
    } catch (err) {
      setPopup(
        err.response?.data?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg mb-4">
            🚀
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Account
          </h1>

          <p className="text-gray-600 mt-2">
            Start sharing files securely
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">

          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition
                ${
                  step >= num
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
            >
              {num === 3 ? "✓" : num}
            </div>
          ))}

        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="you@gmail.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                />
              </div>

              {/* Button */}
              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>

              {/* Login link */}
              <div className="text-center pt-3 border-t border-gray-200">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-blue-600 hover:text-purple-600 font-semibold"
                  >
                    Sign In
                  </a>
                </p>
              </div>

            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6 text-center">

              <h3 className="text-xl font-semibold text-gray-800">
                Verify Email
              </h3>

              <p className="text-gray-600 text-sm">
                OTP sent to <br />
                <span className="font-medium">
                  {form.email}
                </span>
              </p>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                maxLength={6}
                onChange={(e) =>
                  setOtp(e.target.value)
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition text-center text-xl tracking-widest"
              />

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-60"
              >
                {loading
                  ? "Verifying..."
                  : "Verify & Register"}
              </button>

              <button
                onClick={sendOtp}
                className="text-blue-600 hover:text-purple-600 text-sm"
              >
                Resend OTP
              </button>

            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="text-center py-8">

              <div className="text-5xl mb-4">
                ✅
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Account Created!
              </h3>

              <p className="text-gray-600 mb-6">
                You can now login to Filezent
              </p>

              <a
                href="/login"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition"
              >
                Go to Login
              </a>

            </div>
          )}

        </div>
      </div>

      {/* Popup */}
      {popup && (
        <Popup
          message={popup}
          onClose={() => setPopup("")}
        />
      )}
    </div>
  );
}

// old code
// import { useState } from "react";
// import api from "../api/axios";
// import Popup from "../components/Popup";

// export default function Register() {
//   const [step, setStep] = useState(1);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [otp, setOtp] = useState("");
//   const [popup, setPopup] = useState("");

//   /* ======================
//      SEND OTP
//   ====================== */
//   const sendOtp = async () => {
//     try {
//       await api.post("/auth/register/send-otp", {
//         email: form.email,
//       });

//       setStep(2);
//     } catch (err) {
//       setPopup(
//         err.response?.data?.message ||
//         "OTP send failed"
//       );
//     }
//   };

//   /* ======================
//      VERIFY & REGISTER
//   ====================== */
//   const verifyOtp = async () => {
//     try {
//       await api.post("/auth/register/verify-otp", {
//         ...form,
//         otp,
//       });

//       setPopup("Registration successful. Please login.");
//       setStep(3);
//     } catch (err) {
//       setPopup(
//         err.response?.data?.message ||
//         "OTP verification failed"
//       );
//     }
//   };

//   return (
//     <>
//       <div className="min-h-64 flex items-center justify-center px-4">
//         <div className="space-y-4 text-center">

//           <h2 className="text-2xl font-bold mb-4">
//             Create Account
//           </h2>

//           {/* STEP 1 */}
//           {step === 1 && (
//             <>
//               <input
//                 className="input"
//                 placeholder="Name"
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     name: e.target.value,
//                   })
//                 }
//               />

//               <input
//                 className="input"
//                 placeholder="Email"
//                 type="email"
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     email: e.target.value,
//                   })
//                 }
//               />

//               <input
//                 className="input"
//                 placeholder="Password"
//                 type="password"
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     password: e.target.value,
//                   })
//                 }
//               />

//               <button
//                 className="btn mt-2 w-full"
//                 onClick={sendOtp}
//               >
//                 Send OTP
//               </button>
//               <div className="text-center text-lg mt-3">
//                 <a
//                   href="/login"
//                   className="text-black underline"
//                 >
//                   Already Register?
//                 </a>
//               </div>
//             </>
//           )}

//           {/* STEP 2 */}
//           {step === 2 && (
//             <>
//               <input
//                 className="input"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//               />

//               <button
//                 className="btn mt-2 w-full"
//                 onClick={verifyOtp}
//               >
//                 Verify & Register
//               </button>
//             </>
//           )}

//           {/* STEP 3 */}
//           {step === 3 && (
//             <div className="text-center">
//               <p className="text-green-600">
//                 Account created successfully
//               </p>

//               <a
//                 href="/login"
//                 className="underline mt-3 block"
//               >
//                 Go to Login
//               </a>
//             </div>
//           )}
//         </div>
//       </div>

//       {popup && (
//         <Popup
//           message={popup}
//           onClose={() => setPopup("")}
//         />
//       )}
//     </>
//   );
// }
