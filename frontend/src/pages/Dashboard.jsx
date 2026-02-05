import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard");

      if (!res?.data?.user) {
        throw new Error("Invalid session");
      }

      setUser(res.data.user);
      setActivities(res.data.activities || []);
    } catch (err) {
      console.error("Dashboard Error:", err);

      setError("Session expired. Please login again.");

      // Auto logout after 2s
      setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="flex flex-col items-center gap-3">
          <div className="spinner"></div>
          <p className="text-gray-600 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  /* =========================
     ERROR STATE
  ========================= */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-sm w-full">
          <p className="text-red-600 font-medium mb-3">{error}</p>
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN UI
  ========================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-6">

      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-4">
        <button
          onClick={() => navigate("/upload")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow"
        >
          ← Back to Upload
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">

        {/* USER CARD */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold gradient-text">
              Dashboard
            </h1>

            <p className="text-gray-600 mt-1">
              Welcome, <span className="font-medium">{user?.name}</span>
            </p>

            <p className="text-sm text-gray-500">
              {user?.email}
            </p>
          </div>

          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center text-xl font-bold shadow">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
        </div>

        {/* ACTIVITY SECTION */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6">

          <h2 className="text-xl font-semibold mb-5">
            Activity History
          </h2>

          {/* EMPTY */}
          {activities.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No activity yet
            </p>
          )}

          {/* LIST */}
          <div className="space-y-4">

            {activities.map((a) => (
              <div
                key={a._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-2xl hover-lift bg-white transition"
              >

                {/* LEFT */}
                <div>
                  <p className="font-medium text-gray-800">

                    {a.type === "UPLOAD" && "📤 Uploaded"}
                    {a.type === "DOWNLOAD" && "⬇ Downloaded"}
                    {a.type === "EMAIL" && "📧 Shared"}

                  </p>

                  <p className="text-sm text-gray-500 mt-1 break-all">

                    {a.fileName || "File"}

                    {a.receiverEmail &&
                      ` → ${a.receiverEmail}`
                    }

                  </p>
                </div>

                {/* RIGHT */}
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(a.createdAt).toLocaleString()}
                </span>

              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}
