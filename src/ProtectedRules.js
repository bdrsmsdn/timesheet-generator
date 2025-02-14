import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
  const { role } = useAuth();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let decoded;
  try {
    decoded = jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(decoded.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
