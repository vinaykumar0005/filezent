import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Download from "./pages/Download";
import Navbar from "./components/Navbar";
import ForgotPassword from "./pages/forgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import { isAuthenticated } from "./utils/auth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/register"
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" />
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
              <Navigate to="/dashboard" />
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


        {/* PRIVATE ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Upload />
              </AppLayout>
            </ProtectedRoute>
          }
        />

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

        {/* DEFAULT */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated() ? "/dashboard" : "/register"} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// old code before protected route
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Upload from "./pages/Upload";
// import Download from "./pages/Download";
// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Navbar />
//       <Routes>
//         <Route
//         path="/"
//         element={
//         <ProtectedRoute> <Upload /> </ProtectedRoute>}/>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/download/:token" element={<Download />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
