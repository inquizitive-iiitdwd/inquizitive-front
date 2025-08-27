import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import api from "../services/api.js"; // Ensure this path is correct
import toast from "react-hot-toast";

const ProtectedRoute = ({ allowedRoles, loginPath }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/users/me", { withCredentials: true });

        if (response.status === 200 && response.data) {
          const fetchedRole = response.data.role;

          if (allowedRoles.includes(fetchedRole)) {
            setIsAuthenticated(true);
          } else {
            toast.error(
              `Access denied. You are a ${fetchedRole}, not authorized for this page.`
            );

            if (fetchedRole === "admin") {
              navigate("/admin-dashboard");
            } else if (fetchedRole === "user") {
              navigate("/show-question");
            } else {
              navigate("/");
            }
          }
        } else {
          toast.error("Authentication failed: Invalid response.");
          navigate(loginPath);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in.");
          navigate(loginPath);
        } else if (error.response?.status === 403) {
          toast.error("Unauthorized access. Redirecting.");
          navigate(loginPath);
        } else {
          toast.error(
            "An unexpected error occurred during authentication. Please try again."
          );
          navigate(loginPath);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, allowedRoles, loginPath]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-2xl">
        Verifying access...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;
