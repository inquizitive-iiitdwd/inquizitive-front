import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import toast, { Toaster } from 'react-hot-toast';

// SVG Icons
const UserIcon = () => (
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
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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

const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-yellow-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const OrganizerLoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      return toast.error("Please fill in all fields");
    }

    console.log('Submitting login with:', credentials);
    setIsLoading(true);
    
    try {
      const response = await api.post('/organizer-login', credentials, { withCredentials: true });
      console.log('Login response:', response.data);
      toast.success('Login successful!');
      navigate('/create-quiz');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2e1a47] via-[#4a2d6b] to-[#624a82] font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-yellow-400/20 p-4 rounded-full border border-yellow-400/30">
              <ShieldIcon />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Organizer Portal
          </h1>
          <p className="text-purple-200 text-lg">
            Access your quiz management dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon />
                </span>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-white/60 transition-all duration-300"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-white mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockIcon />
                </span>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-white/60 transition-all duration-300"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl transition-all duration-300 hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent transform hover:scale-[1.02] flex items-center justify-center gap-3 ${
                isLoading ? "cursor-not-allowed opacity-75" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <ShieldIcon />
                  Access Dashboard
                </>
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                <strong>Organizer Access Only</strong><br />
                Contact your administrator for account credentials
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/60">
          <p className="text-sm">
            Secure organizer portal for InQuizitive Club
          </p>
        </div>
      </div>
      
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
        }}
      />
    </div>
  );
};

export default OrganizerLoginPage;