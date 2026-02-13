import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getItem } from "../Services/LocalStorage.Service";

interface Props {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<Props> = ({ allowedRoles }) => {
  const token = getItem("token");
  const role = getItem("role");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role-based protection
  if (allowedRoles && !allowedRoles.includes(role?.toLowerCase())) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
