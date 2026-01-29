// import { useParams } from "react-router-dom";

// export default function Download() {
//   const { token } = useParams();

//   const downloadUrl = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/files/download/${token}`;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">

//       <div className="w-full max-w-lg">

//         {/* MAIN CARD */}
//         <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">

//           {/* ICON */}
//           <div className="text-center mb-8">

//             <div className="relative inline-flex">

//               <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl transform hover:scale-110 transition">
//                 📥
//               </div>

//               <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
//                 ✓
//               </div>

//             </div>

//           </div>

//           {/* TITLE */}
//           <div className="text-center mb-8">

//             <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
//               Your File is Ready
//             </h1>

//             <p className="text-gray-600">
//               Click below to download securely
//             </p>

//           </div>

//           {/* FILE INFO */}
//           <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 mb-6 border border-blue-100">

//             <div className="flex items-center gap-4">

//               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow">
//                 📄
//               </div>

//               <div className="flex-1">

//                 <p className="font-semibold text-gray-800">
//                   Shared File
//                 </p>

//                 <p className="text-sm text-gray-500">
//                   Available for download
//                 </p>

//               </div>

//             </div>

//           </div>

//           {/* DOWNLOAD BUTTON */}
//           <a
//             href={downloadUrl}
//             className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition text-center text-lg"
//           >

//             <span className="flex items-center justify-center gap-2">
//               ⬇️ Download File
//             </span>

//           </a>

//           {/* SECURITY NOTICE */}
//           <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">

//             <div className="flex gap-3">

//               <div className="text-xl">⚠️</div>

//               <div>

//                 <p className="text-sm font-semibold text-yellow-800">
//                   Security Notice
//                 </p>

//                 <p className="text-xs text-yellow-700 mt-1">
//                   This file will be deleted after 24 hours
//                 </p>

//               </div>

//             </div>

//           </div>

//         </div>

//         {/* FEATURES */}
//         <div className="grid grid-cols-3 gap-4 mt-8">

//           {[
//             { icon: "🔐", text: "Secure" },
//             { icon: "⚡", text: "Fast" },
//             { icon: "✅", text: "Verified" },
//           ].map((f, i) => (
//             <div
//               key={i}
//               className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-100"
//             >

//               <div className="text-2xl mb-2">
//                 {f.icon}
//               </div>

//               <p className="text-xs font-medium text-gray-700">
//                 {f.text}
//               </p>

//             </div>
//           ))}

//         </div>

//         {/* FOOTER */}
//         <p className="text-center text-sm text-gray-500 mt-8">
//           Powered by Filezent • Secure File Sharing
//         </p>

//       </div>

//     </div>
//   );
// }
