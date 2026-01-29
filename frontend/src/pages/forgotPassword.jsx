import { useState, useEffect } from "react";
import api from "../api/axios";
import Popup from "../components/Popup";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [popup, setPopup] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  /* =========================
     OTP TIMER
  ========================= */
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* =========================
     SEND OTP
  ========================= */
  const sendOtp = async () => {
    if (!email) {
      setPopup("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/forgot-password", {
        email,
      });

      setTimer(60);
      setStep(2);
    } catch (err) {
      setPopup(
        err.response?.data?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RESET PASSWORD
  ========================= */
  const resetPassword = async () => {
    if (!otp || !newPassword) {
      setPopup(
        "Please enter OTP and new password."
      );
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      setPopup(
        "Password reset successful. Please login."
      );

      setStep(3);
    } catch (err) {
      setPopup(
        err.response?.data?.message ||
          "Invalid OTP or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg mb-4">
            🔑
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Reset Password
          </h1>

          <p className="text-gray-600 mt-2">
            Recover your Filezent account
          </p>

        </div>

        {/* STEP INDICATOR */}
        <div className="flex items-center justify-center gap-3 mb-8">

          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition
                ${
                  step >= num
                    ? num === 3
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
            >
              {num === 3 ? "✓" : num}
            </div>
          ))}

        </div>

        {/* CARD */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">

          {/* STEP 1 — EMAIL */}
          {step === 1 && (
            <div className="space-y-6 text-center">

              <h3 className="text-xl font-semibold text-gray-800">
                Enter Your Email
              </h3>

              <p className="text-sm text-gray-600">
                We’ll send you a verification code
              </p>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
              />

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition disabled:opacity-60"
              >
                {loading
                  ? "Sending..."
                  : "Send OTP"}
              </button>

              <a
                href="/login"
                className="block text-sm text-blue-600 hover:text-purple-600"
              >
                ← Back to Login
              </a>

            </div>
          )}

          {/* STEP 2 — OTP + PASSWORD */}
          {step === 2 && (
            <div className="space-y-6 text-center">

              <h3 className="text-xl font-semibold text-gray-800">
                Verify & Reset
              </h3>

              <p className="text-sm text-gray-600">
                Code sent to{" "}
                <span className="font-medium">
                  {email}
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition text-center text-xl tracking-widest font-semibold"
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
              />

              <button
                onClick={resetPassword}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition disabled:opacity-60"
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>

              <button
                disabled={timer > 0}
                onClick={sendOtp}
                className={`w-full text-sm transition ${
                  timer > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:text-purple-600"
                }`}
              >
                {timer > 0
                  ? `Resend OTP in ${timer}s`
                  : "Resend OTP"}
              </button>

            </div>
          )}

          {/* STEP 3 — SUCCESS */}
          {step === 3 && (
            <div className="text-center py-8">

              <div className="text-5xl mb-4">
                ✅
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Password Updated
              </h3>

              <p className="text-gray-600 mb-6">
                You can now login
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

      {/* POPUP */}
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
// import { useState, useEffect } from "react";
// import api from "../api/axios";
// import Popup from "../components/Popup";

// export default function ForgotPassword() {
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [popup, setPopup] = useState("");
//   const [timer, setTimer] = useState(0);

//   /* =========================
//      OTP TIMER
//   ========================= */
//   useEffect(() => {
//     if (timer <= 0) return;

//     const interval = setInterval(() => {
//       setTimer((t) => t - 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timer]);

//   /* =========================
//      SEND OTP
//   ========================= */
//   const sendOtp = async () => {
//     if (!email) {
//       setPopup("Please enter your email.");
//       return;
//     }

//     try {
//       await api.post("/auth/forgot-password", { email });
//       setTimer(60);
//       setStep(2);
//     } catch {
//       setPopup("Unable to send OTP. Please try again.");
//     }
//   };

//   /* =========================
//      VERIFY OTP & RESET PASSWORD
//   ========================= */
//   const resetPassword = async () => {
//     if (!otp || !newPassword) {
//       setPopup("Please enter OTP and new password.");
//       return;
//     }

//     try {
//       await api.post("/auth/reset-password", {
//         email,
//         otp,
//         newPassword,
//       });

//       setPopup("Password reset successful. Please login.");
//       setStep(3);
//     } catch {
//       setPopup("Invalid OTP or expired OTP.");
//     }
//   };

//   return (
//     <>
//       <div className="min-h-64 flex items-center justify-center px-4">
//         <div className="space-y-4 text-center">
//           <h2 className="text-2xl font-bold mb-4">
//             Forgot Password
//           </h2>

//           {/* STEP 1 — EMAIL */}
//           {step === 1 && (
//             <>
//               <input
//                 className="input"
//                 placeholder="Enter registered email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               <button className="btn mt-2 w-full"
//                 onClick={sendOtp}>
//                 Send OTP
//               </button>
//             </>
//           )}

//           {/* STEP 2 — OTP + PASSWORD */}
//           {step === 2 && (
//             <>
//               <input
//                 className="input"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//               />
//               <input
//                 className="input"
//                 type="password"
//                 placeholder="New password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />

//               <button className="btn mt-2 w-full"
//                 onClick={resetPassword}>
//                 Reset Password
//               </button>

//               <button
//                 disabled={timer > 0}
//                 onClick={sendOtp}
//                 className="mt-3 text-sm text-center w-full underline disabled:text-gray-400 "
//               >
//                 {timer > 0
//                   ? `Resend OTP in ${timer}s`
//                   : "Resend OTP"}
//               </button>
//             </>
//           )}

//           {/* STEP 3 — SUCCESS */}
//           {step === 3 && (
//             <div className="text-center">
//               <p className="text-green-600 font-medium">
//                 Password updated successfully.
//               </p>
//               <a
//                 href="/login"
//                 className="underline text-black block mt-4"
//               >
//                 Go to Login
//               </a>
//             </div>
//           )}
//         </div>
//       </div>

//       {popup && <Popup message={popup} onClose={() => setPopup("")} />}
//     </>
//   );
// }
