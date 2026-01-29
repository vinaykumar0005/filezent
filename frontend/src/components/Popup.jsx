import { useEffect } from "react";

export default function Popup({ message, onClose, type = "info" }) {

  /* ===============================
     AUTO CLOSE (5s)
  =============================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);


  /* ===============================
     DISABLE SCROLL
  =============================== */
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);


  /* ===============================
     ICON
  =============================== */
  const getIcon = () => {

    if (type === "success") {
      return (
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    }

    if (type === "error") {
      return (
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    }

    if (type === "warning") {
      return (
        <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      );
    }

    // Default (info)
    return (
      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  };


  /* ===============================
     COLOR THEME
  =============================== */
  const getColors = () => {

    if (type === "success") return "from-green-600 to-emerald-600";
    if (type === "error") return "from-red-600 to-rose-600";
    if (type === "warning") return "from-yellow-600 to-amber-600";

    return "from-blue-600 to-purple-600";
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }

        .animate-shrink {
          animation: shrink 5s linear;
        }
      `}</style>


      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />


      {/* Popup Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full animate-scaleIn">


        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>


        {/* Content */}
        <div className="p-8">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            {getIcon()}
          </div>


          {/* Message */}
          <div className="text-center mb-6">
            <p className="text-gray-800 text-lg leading-relaxed">
              {message}
            </p>
          </div>


          {/* OK Button */}
          <button
            onClick={onClose}
            className={`w-full bg-gradient-to-r ${getColors()} text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
          >
            OK
          </button>

        </div>


        {/* Timer Bar */}
        <div className="h-1 bg-gray-100 rounded-b-3xl overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getColors()} animate-shrink`}
          />
        </div>

      </div>
    </div>
  );
}

// old code
// export default function Popup({ message, onClose }) {
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-lg">
//                 <p className="text-gray-800 mb-4">{message}</p>
//                 <button
//                     onClick={onClose}
//                     className="bg-black text-white px-4 py-2 rounded"
//                 >
//                     OK
//                 </button>
//             </div>
//         </div>
//     );
// }
