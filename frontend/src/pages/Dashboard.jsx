import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard");

      setUser(res.data.user);
      setActivities(res.data.activities);

    } catch (err) {
      console.error("Dashboard Error:", err);
      alert("Login again");

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl mb-8">

          <h1 className="text-3xl font-bold gradient-text">
            Dashboard
          </h1>

          <p className="text-gray-600 mt-1">
            Welcome, {user.name}
          </p>

          <p className="text-sm text-gray-500">
            {user.email}
          </p>
        </div>

        {/* ACTIVITY */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6">

          <h2 className="text-xl font-semibold mb-4">
            Activity History
          </h2>

          {activities.length === 0 && (
            <p className="text-gray-500 text-center">
              No activity yet
            </p>
          )}

          <div className="space-y-4">

            {activities.map((a) => (
              <div
                key={a._id}
                className="flex justify-between items-center p-4 border rounded-xl hover-lift bg-white"
              >

                <div>
                  <p className="font-medium text-gray-800">

                    {a.type === "UPLOAD" && "📤 Uploaded"}
                    {a.type === "DOWNLOAD" && "⬇ Downloaded"}
                    {a.type === "EMAIL" && "📧 Shared"}

                  </p>

                  <p className="text-sm text-gray-500">

                    {a.fileName || "File"}

                    {a.receiverEmail &&
                      ` → ${a.receiverEmail}`
                    }

                  </p>
                </div>

                <span className="text-xs text-gray-400">
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
