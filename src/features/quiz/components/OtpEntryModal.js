import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { FaTimes, FaKey } from "react-icons/fa";

/**
 * A modal for entering the OTP (key) received via email.
 * On submission, it passes the key to the parent for final verification.
 */
const OtpEntryModal = ({ isOpen, onClose, onSubmit, email }) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || otp.length < 4) return;

    setIsSubmitting(true);
    try {
      // The parent's onSubmit function will handle API call and navigation
      await onSubmit({ otp });
    } catch (error) {
      console.error("OTP submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#2e1a47] to-[#1e103a] border border-purple-700 p-8 rounded-2xl w-full max-w-md relative shadow-2xl animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-3xl text-white font-bold mb-4 text-center">
          Enter Access Code
        </h2>
        <p className="text-center text-gray-400 mb-8">
          A 4-digit code was sent to <br />
          <span className="font-semibold text-yellow-300">{email}</span>
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              pattern="\d{4}"
              maxLength="4"
              value={otp}
              className="bg-gray-900/50 text-white w-full pl-12 pr-4 py-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all tracking-[1em] text-center"
              placeholder="----"
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white font-bold px-4 py-3 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={isSubmitting || otp.length < 4}
          >
            {isSubmitting ? "Verifying..." : "Enter Quiz Room"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpEntryModal;
