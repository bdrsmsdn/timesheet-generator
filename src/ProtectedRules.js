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
    return <Navigate to="/" replace />;
  }

  const isExpired = decoded.exp && decoded.exp * 1000 < Date.now();
  if (isExpired) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (!decoded.role || !allowedRoles.includes(decoded.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
