import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api.js";
import toast, { Toaster } from "react-hot-toast";

// --- Reusable SVG Icons ---
const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16 text-green-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16 text-green-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);
const LoadingSpinner = ({ size = "h-16 w-16" }) => (
  <svg
    className={`animate-spin text-white ${size}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const QuizTimer = () => {
  const [roomKey, setRoomKey] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizData, setQuizData] = useState(null);
  const [status, setStatus] = useState("loading"); // 'loading', 'scheduled', 'countdown', 'ready', 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Effect 1: Fetch quiz schedule data from the API
  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const response = await api.get("/QuizSetUp/getSaveTimer");
        if (response.data && response.data.length > 0) {
          setQuizData(response.data[0]);
        } else {
          throw new Error("No quiz schedule found.");
        }
      } catch (error) {
        console.error("Error fetching timer:", error);
        setStatus("error");
      }
    };
    fetchTimer();
  }, []);

  // Effect 2: Calculate time and set up the interval once quizData is available
  useEffect(() => {
    if (!quizData) return;

    // NOTE: This logic assumes the server and client are in the same timezone.
    // For production, it's safer for the API to return a full ISO 8601 UTC timestamp.
    const targetDateTime = new Date(
      `${quizData.date.slice(0, 10)}T${quizData.time}`
    );
    const now = new Date();

    const timeDifference = Math.round(
      (targetDateTime.getTime() - now.getTime()) / 1000
    );

    if (timeDifference > 0) {
      setTimeLeft(timeDifference);
      setStatus("countdown");
    } else {
      setTimeLeft(0);
      setStatus("ready");
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setStatus("ready");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizData]);

  const handleKeySubmit = async (e) => {
    e.preventDefault();
    if (status !== "ready" || !roomKey) {
      return toast.error(
        "Please wait for the quiz to start and enter a room key."
      );
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/events/accessingquizroombykey", {
        key: roomKey,
      });

      if (response.status === 200) {
        toast.success("Key accepted! Entering quiz...");
        navigate("/showquestion", { state: { roomKey } });
      } else {
        // This part might not be reached if axios throws on non-2xx status
        toast.error("Invalid room key.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid room key.");
      console.error("Error accessing quiz room:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (time) => {
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = time % 60;
    return {
      hrs: hrs.toString().padStart(2, "0"),
      mins: mins.toString().padStart(2, "0"),
      secs: secs.toString().padStart(2, "0"),
    };
  };

  const formattedTime = formatTime(timeLeft);
  const formattedQuizDate = quizData
    ? new Date(`${quizData.date.slice(0, 10)}T${quizData.time}`).toLocaleString(
        undefined,
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      )
    : "";

  // --- Render logic based on status ---
  const renderContent = () => {
    switch (status) {
      case "loading":
        return <LoadingSpinner />;
      case "error":
        return (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">
              Failed to Load Quiz
            </h1>
            <p className="text-gray-300">
              Could not retrieve the quiz schedule. Please try refreshing the
              page.
            </p>
          </div>
        );
      case "countdown":
      case "ready":
        return (
          <>
            <ClockIcon />
            <h1 className="text-3xl font-bold text-white mt-4">
              {status === "countdown" ? "Quiz Starts In" : "Quiz is Live!"}
            </h1>
            <div className="flex justify-center gap-4 my-6">
              {["hrs", "mins", "secs"].map((unit) => (
                <div key={unit} className="text-center">
                  <div className="text-5xl font-mono bg-white/10 p-4 rounded-lg text-white">
                    {formattedTime[unit]}
                  </div>
                  <div className="text-xs uppercase text-gray-300 mt-2">
                    {unit}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleKeySubmit}
              className="w-full max-w-sm mx-auto flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Enter Room Key"
                value={roomKey}
                onChange={(e) => setRoomKey(e.target.value)}
                className="w-full p-3 bg-gray-900/50 text-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 text-center"
                disabled={status !== "ready"}
              />
              <button
                type="submit"
                className={`w-full p-3 bg-green-600 text-white rounded-lg font-bold transition duration-300 ease-in-out flex items-center justify-center ${
                  status !== "ready" || isSubmitting
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-green-700"
                }`}
                disabled={status !== "ready" || isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="h-5 w-5" />
                ) : (
                  "Enter Quiz Room"
                )}
              </button>
            </form>
            {status === "countdown" && (
              <p className="text-gray-400 mt-4 text-sm">
                The room key can be entered once the timer ends.
              </p>
            )}
          </>
        );
      default: // Handles 'scheduled' or any other unforeseen state
        return (
          <div className="text-center">
            <CalendarIcon />
            <h1 className="text-3xl font-bold text-white mt-4">
              Quiz is Scheduled
            </h1>
            <p className="text-gray-300 mt-2 text-lg">Please come back on:</p>
            <p className="text-2xl font-semibold text-green-300 mt-2">
              {formattedQuizDate}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-[#2e1a47] to-[#624a82] font-sans flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="relative bg-[#2e1a47] bg-opacity-40 p-8 rounded-xl shadow-2xl w-full max-w-2xl text-center border border-purple-400/30">
        {renderContent()}
      </div>
    </div>
  );
};

export default QuizTimer;
