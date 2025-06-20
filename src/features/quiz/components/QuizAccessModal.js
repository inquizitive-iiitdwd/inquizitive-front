import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FaTimes, FaUsers, FaEnvelope } from 'react-icons/fa';

const QuizAccessModal = ({ isOpen, onClose, onSubmit }) => {
  const [teamname, setTeamname] = useState('');
  const [teamleademailid, setTeamleademailid] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // The onSubmit function is passed from the parent and contains the API call
      await onSubmit({ teamname, teamleademailid });
      // Reset form on successful submission if needed, or let parent handle closing
      setTeamname('');
      setTeamleademailid('');
    } catch (error) {
      // Error is already toasted in the parent, but you could add specific modal feedback here
      console.error("Submission failed:", error);
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
        
        <h2 className="text-3xl text-white font-bold mb-6 text-center">Enter Quiz Room</h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={teamname}
              className="bg-gray-900/50 text-white w-full pl-12 pr-4 py-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              placeholder="Enter your team name"
              onChange={(e) => setTeamname(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={teamleademailid}
              className="bg-gray-900/50 text-white w-full pl-12 pr-4 py-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              placeholder="Enter team lead's email"
              onChange={(e) => setTeamleademailid(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-yellow-400 text-black font-bold px-4 py-3 rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Access Room'}
          </button>
        </form>
      </div>
      {/* Toaster can be kept in a top-level component like App.js, but here is fine too */}
      <Toaster position="top-right" toastOptions={{
        className: 'bg-gray-800 text-white',
      }}/>
    </div>
  );
};

export default QuizAccessModal;