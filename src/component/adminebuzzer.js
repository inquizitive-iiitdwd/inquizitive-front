import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";
import toast from "react-hot-toast";
import api from "../services/api.js";
import NavBar from "./NavBar.js";

const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000", {
  withCredentials: true,
  autoConnect: false,
});

const AdminBuzzer = () => {
  const [arraykadata, setArraykadata] = useState([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const quizname = state?.quizname || "Unknown";

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        await api.get("/users/me", { withCredentials: true });
        socket.connect();
        socket.emit("joinQuiz", quizname);
      } catch (error) {
        toast.error("Please log in as an admin");
        navigate("/admin-login");
      }
    };
    checkAdmin();

    socket.on("connect", () => {
      console.log("Connected with socket ID:", socket.id);
    });

    socket.on("arraydata", (data) => {
      console.log("Received arraydata:", data);
      setArraykadata(data);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate, quizname]);

  const handleStartButton1 = () => {
    const audio = new Audio("/images/tickingbuzzer-75859.mp3");
    audio.play().catch((err) => console.error("Audio play error:", err));
    socket.emit("Set", 1);
    console.log("Emitted Set event");
  };

  const handleLeaderboardTime = () => {
    socket.emit("array");
    console.log("Emitted array event");
  };

  return (
    <div className="bg-gradient-to-r from-[#2e1a47] to-[#624a82] min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Buzzer for {quizname}</h2>
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleStartButton1}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Start Buzzer
            </button>
            <button
              onClick={handleLeaderboardTime}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
            >
              Leaderboard Time
            </button>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Leaderboard:</h3>
            <div className="space-y-2">
              {arraykadata.map((i, index) => (
                <div key={index} className="bg-gray-200 p-2 rounded">
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBuzzer;
