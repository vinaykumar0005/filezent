import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Download from "./pages/Download";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import { isAuthenticated } from "./utils/auth";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route
          path="/register"
          element={
            isAuthenticated() ? (
              <Navigate to="/upload" />
            ) : (
              <AuthLayout>
                <Register />
              </AuthLayout>
            )
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated() ? (
              <Navigate to="/upload" />
            ) : (
              <AuthLayout>
                <Login />
              </AuthLayout>
            )
          }
        />

        <Route
          path="/forgot-password"
          element={
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          }
        />

        {/* ================= PRIVATE ================= */}

        {/* Upload = MAIN PAGE */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Upload />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Download */}
        <Route
          path="/download/:token"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Download />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* ================= DEFAULT ================= */}

        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated() ? "/upload" : "/login"}
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}