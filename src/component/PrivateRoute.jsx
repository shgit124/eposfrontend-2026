


import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute({ allowedRole }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== allowedRole) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "staff") {
      return <Navigate to="/billing" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;

