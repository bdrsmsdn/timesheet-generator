import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import UserLayout from "layouts/user";

const isAdmin = localStorage.getItem("role") === "admin";

const App = () => {
  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      
      {/* Hanya admin yang bisa akses */}
      {isAdmin && <Route path="admin/*" element={<AdminLayout />} />}
      
      {/* Non-admin ke user layout */}
      {!isAdmin && <Route path="user/*" element={<UserLayout />} />}
      
      <Route path="rtl/*" element={<RtlLayout />} />
      
      <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
};

export default App;
