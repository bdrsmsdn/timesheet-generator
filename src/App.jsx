import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import UserLayout from "layouts/user";
import ProtectedRoute from "./ProtectedRules";
import Unauthorized from "./views/403";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />

        {/* Halaman Admin (Hanya Admin yang bisa akses) */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="admin/*" element={<AdminLayout />} />
        </Route>

        {/* Halaman User (Hanya User yang bisa akses) */}
        <Route element={<ProtectedRoute allowedRoles={["staff"]} />}>
          <Route path="user/*" element={<UserLayout />} />
        </Route>

        {/* Halaman Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Redirect ke login jika tidak ada rute yang cocok */}
        <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
