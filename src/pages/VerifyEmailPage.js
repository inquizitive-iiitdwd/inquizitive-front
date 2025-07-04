import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api.js";
import Nav from "../component/NavBar.js";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Verifying your account, please wait..."
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found. Please check the link.");
      return;
    }

    const verifyUserEmail = async () => {
      try {
        const response = await api.get(`/users/verify-email/${token}`);
        setStatus("success");
        setMessage(response.data.message);
      } catch (error) {
        setStatus("error");
        const errorMessage =
          error.response?.data?.error || "An unknown error occurred.";
        setMessage(errorMessage);
        console.error("Verification failed:", error);
      }
    };

    verifyUserEmail();
  }, [token]);

  const renderStatus = () => {
    if (status === "success") {
      return (
        <>
          <svg
            className="mx-auto h-16 w-16 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="text-2xl font-bold mt-4">Verification Complete!</h3>
          <p className="mt-2 text-gray-300">{message}</p>
          <button
            onClick={() => navigate("/client-login")}
            className="mt-6 w-full px-4 py-3 bg-green-600 text-white rounded-lg font-bold transition hover:bg-green-700"
          >
            Proceed to Login
          </button>
        </>
      );
    }

    if (status === "error") {
      return (
        <>
          <svg
            className="mx-auto h-16 w-16 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="text-2xl font-bold mt-4">Verification Failed</h3>
          <p className="mt-2 text-gray-300">{message}</p>
          <Link
            to="/client-login"
            className="mt-6 inline-block text-green-400 font-bold hover:underline"
          >
            Go to Login Page
          </Link>
        </>
      );
    }
    return (
      <>
        <svg
          className="animate-spin mx-auto h-16 w-16 text-white"
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
        <h3 className="text-2xl font-bold mt-4">Verifying...</h3>
        <p className="mt-2 text-gray-300">{message}</p>
      </>
    );
  };

  return (
    <>
      <Nav />
      <div className="relative min-h-screen bg-gradient-to-r from-[#2e1a47] to-[#624a82] font-sans flex items-center justify-center p-4">
        <div className="relative text-center text-white bg-[#2e1a47] bg-opacity-40 p-8 rounded-xl shadow-2xl w-full max-w-md border border-purple-400/30">
          {renderStatus()}
        </div>
      </div>
    </>
  );
};

export default VerifyEmailPage;
