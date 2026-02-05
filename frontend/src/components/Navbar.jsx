import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b">

      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/upload"
          className="text-xl font-bold text-blue-600"
        >
          Filezent
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-6">

          <Link
            to="/upload"
            className="text-gray-600 hover:text-blue-600"
          >
            Upload
          </Link>

          <Link
            to="/dashboard"
            className="text-gray-600 hover:text-blue-600"
          >
            Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}
