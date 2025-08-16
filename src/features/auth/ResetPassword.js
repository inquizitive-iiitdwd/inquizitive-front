import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Nav from "../../component/NavBar.js";

// SVG Icons
const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const ResetPassword = () => {
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sendingMailVerification, setSendingMailVerification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isRequestingReset, setIsRequestingReset] = useState(!token);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setIsRequestingReset(false);
    }
  }, [token]);

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const requestPasswordReset = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      setSendingMailVerification(true);
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      console.log("Using BACKEND_URL:", backendUrl);
      const data = { email };
      const response = await axios.post(
        `${backendUrl}/users/request-password-reset`,
        data,
        { withCredentials: false }
      );
      if (response.data.message.includes("exists")) {
        toast.success(
          "If an account exists, a reset link has been sent to your email!"
        );
        setSuccessMessage(
          `We have sent a reset link to ${email}. Please check your inbox.`
        );
      } else {
        toast.error("Failed to request reset. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting reset:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config,
      });
      toast.error("Failed to request reset. Please try again.");
    } finally {
      setSendingMailVerification(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault(); // Prevent default form behavior if within a form
    console.log("Set Password button clicked");
    if (!token) {
      toast.error("No reset token found. Please use the link from your email.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!validatePassword(password)) {
      toast.error(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      console.log("Reset Password URL:", `${backendUrl}/users/reset-password`);
      const data = { token, password };
      const response = await axios.post(
        `${backendUrl}/users/reset-password`,
        data,
        { withCredentials: false }
      );
      if (response.data.message) {
        toast.success("Password reset successfully!");
        navigate("/client-login");
      }
    } catch (error) {
      console.error("Error resetting password:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config,
      });
      toast.error(
        `Failed to reset password. ${
          error.response?.data?.error || "Invalid or expired token."
        }`
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-[#2e1a47] to-[#624a82] font-sans">
      <Nav />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-[#2e1a47] bg-opacity-40 p-8 rounded-xl shadow-2xl w-full max-w-md border border-purple-400/30">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            {isRequestingReset ? "Reset Password" : "Set New Password"}
          </h2>

          {isRequestingReset ? (
            <form className="flex flex-col space-y-6">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 text-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                  placeholder="Enter your Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={sendingMailVerification}
                />
              </div>
              <button
                className={`w-full px-4 py-3 bg-green-600 text-white rounded-lg font-bold transition duration-300 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center ${
                  sendingMailVerification ? "cursor-not-allowed opacity-75" : ""
                }`}
                onClick={requestPasswordReset}
                disabled={sendingMailVerification}
              >
                {sendingMailVerification ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Sending...
                  </>
                ) : (
                  "Verify"
                )}
              </button>
              {successMessage && (
                <p className="mt-4 text-center text-green-400 font-bold">
                  {successMessage}
                </p>
              )}
            </form>
          ) : (
            <form
              className="flex flex-col space-y-6"
              onSubmit={handleResetPassword}
            >
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockIcon />
                </span>
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 text-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockIcon />
                </span>
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 text-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                type="submit" // Changed to submit to work with form
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-bold transition duration-300 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                onClick={handleResetPassword}
              >
                Set Password
              </button>
            </form>
          )}

          <div className="text-center text-gray-300 text-sm space-y-2 pt-6">
            <p>
              Back to{" "}
              <a
                href="/client-login"
                className="text-green-400 font-bold hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/client-login");
                }}
              >
                Login
              </a>
            </p>
          </div>
        </div>
        <footer className="absolute bottom-4 w-full text-center text-white/60 z-10 text-sm">
          Created by{" "}
          <a
            href="https://github.com/maheshkatyayan"
            className="text-green-400 font-semibold hover:underline"
          >
            codecraftmen
          </a>
        </footer>
      </div>
    </div>
  );
};

export default ResetPassword;
