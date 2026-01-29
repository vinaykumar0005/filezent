import { logout } from "../utils/auth";
import { Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  return (
    <header className="bg-black/60 backdrop-blur border-b border-gray-700">
      <div className="container-app flex items-center justify-between h-16">

        <Link to="/" className="text-xl font-bold">
          Filezent
        </Link>

        <nav className="flex gap-4 items-center text-sm">

          <Link
            to="/upload"
            className="hover:text-gray-300"
          >
            Upload
          </Link>

          <button
            onClick={logout}
            className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
