import React from 'react';
import { useNavigate } from 'react-router-dom';

// A reusable lock icon for a clear visual message
const LockIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-20 w-20 text-green-400 mx-auto" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={1.5}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
    />
  </svg>
);

// Renamed for clarity
const NotLoggedInPage = () => {
  const navigate = useNavigate();

  return (
    // Using the consistent gradient background from other pages
    <div className="relative min-h-screen bg-gradient-to-r from-[#2e1a47] to-[#624a82] font-sans flex items-center justify-center p-4">
      
      {/* A modern card layout for the message, consistent with login/register pages */}
      <div className="relative bg-[#2e1a47] bg-opacity-40 p-10 rounded-xl shadow-2xl w-full max-w-lg text-center border border-purple-400/30">
        
        <LockIcon />

        <h1 className="text-3xl font-bold text-white mt-6">
          Authentication Required
        </h1>

        <p className="text-gray-300 mt-3 mb-8">
          You must be logged in to view this page. Please log in to your account or create a new one to continue.
        </p>

        {/* Clear, actionable buttons to guide the user */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/Clientlogin')}
            className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white rounded-lg font-bold transition duration-300 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')} // Updated to the new register route
            className="w-full sm:w-auto px-8 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-bold transition duration-300 ease-in-out hover:bg-white/20"
          >
            Sign Up
          </button>
        </div>

        <div className="mt-10">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-400 hover:text-white hover:underline transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
      
       <footer className="absolute bottom-4 w-full text-center text-white/60 z-10 text-sm">
          Created by <a href="https://github.com/maheshkatyayan" className="text-green-400 font-semibold hover:underline">codecraftmen</a>
        </footer>
    </div>
  );
};

export default NotLoggedInPage;