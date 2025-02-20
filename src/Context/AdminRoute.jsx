import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.role !== "Admin") {
    return <Navigate to="/" replace />; // Redirect to the home page or another route
  }

  return children;
};

export default AdminRoute;
