import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "../features/admin/components/Sidebar.js";
import QuizManager from "../features/admin/views/QuizManager.js";
import MemberManagement from "../features/admin/views/MemberManagement.js";
import api from '../services/api.js';

const DashboardHome = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-white">Welcome, Admin!</h1>
    <p className="text-gray-400 mt-2">
      Select a category from the sidebar to manage your club's activities.
    </p>
  </div>
);

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("quizzes");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      try {
        await api.get("/users/me", { withCredentials: true });
      } catch (error) {
        if (isMounted) {
          toast.error("Please log in as an admin");
          navigate("/admin-login");
        }
      }
    };
    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully");
      navigate("/admin-login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const renderView = () => {
    switch (activeView) {
      case "quizzes":
        return <QuizManager />;
      case "members":
        return <MemberManagement />;
      case "dashboard":
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#2e1a47] to-[#1a0e2e] min-h-screen text-white flex">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        handleLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto">{renderView()}</main>
    </div>
  );
};

export default AdminDashboard;