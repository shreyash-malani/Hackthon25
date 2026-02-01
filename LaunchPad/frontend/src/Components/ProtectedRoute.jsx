// filepath: d:\LaunchPad\frontend\src\Components\ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading indicator while determining auth state
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;