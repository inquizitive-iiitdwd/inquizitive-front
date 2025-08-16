import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { FaTimes, FaEnvelope } from "react-icons/fa";

/**
 * A modal to collect the team lead's email to initiate the quiz access flow.
 * On submission, it triggers a parent function to call the backend and send an OTP.
 */
const QuizAccessModal = ({ isOpen, onClose, onSubmit }) => {
  // State is simplified: we only need the email.
  const [teamleademailid, setTeamleademailid] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !teamleademailid) return;

    setIsSubmitting(true);
    try {
      // The onSubmit function (from the parent) will now return true on success.
      // This allows the parent to control the entire flow.
      const success = await onSubmit({ teamleademailid });

      // If the parent signals success, we can clear the form.
      // The parent will be responsible for closing this modal and showing the next step.
      if (success) {
        setTeamleademailid("");
      }
    } catch (error) {
      // The parent's `onSubmit` function will handle toasting the error message.
      console.error("Submission failed in modal:", error);
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

        {/* --- UX Improvement: Title is more accurate --- */}
        <h2 className="text-3xl text-white font-bold mb-6 text-center">
          Get Quiz Access Code
        </h2>
        <p className="text-center text-gray-400 -mt-4 mb-8">
          A verification code will be sent to your email.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* --- The Team Name input is removed --- */}
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={teamleademailid}
              className="bg-gray-900/50 text-white w-full pl-12 pr-4 py-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              placeholder="Enter your team lead's email"
              onChange={(e) => setTeamleademailid(e.target.value)}
              required
            />
          </div>

          {/* --- UX Improvement: Button text is more accurate --- */}
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-bold px-4 py-3 rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending Code..." : "Get Access Code"}
          </button>
        </form>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "bg-gray-800 text-white",
        }}
      />
    </div>
  );
};

export default QuizAccessModal;
