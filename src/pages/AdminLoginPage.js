import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
// import NavBar from '../component/NavBar.js';

// SVG Icons
const AdminIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-teal-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const EmailIcon = () => (
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
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const KeyIcon = () => (
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
      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 text-teal-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.post('/admine/login', { email, password }, { withCredentials: true });
      toast.success(response.data.message);
      navigate('/admin-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.code === 'Enter') {
      handleLogin(e);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#2e1a47] to-[#624a82] min-h-screen">
      {/* <NavBar /> */}
      <div className="flex items-center justify-center min-h-screen text-white px-4">
        <div className="w-full max-w-lg">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 rounded-full shadow-2xl">
                  <LockIcon />
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 p-2 rounded-full shadow-lg">
                  <AdminIcon />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-teal-300 to-teal-500 bg-clip-text text-transparent">
              System Administrator
            </h1>
            <p className="text-gray-300 text-lg font-medium">
              Secure access to administrative controls
            </p>
          </div>

          {/* Login Form */}
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-teal-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
            
            <div className="relative bg-gray-900/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50">
              {/* Security Badge */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2 rounded-full text-sm font-bold text-white border-2 border-gray-900">
                  🔒 SECURE LOGIN
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-6 mt-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Administrator Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EmailIcon />
                    </div>
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-4 bg-gray-800/80 backdrop-blur-sm text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400 transition-all duration-300 group-hover:bg-gray-800/90"
                      placeholder="admin@inquizitive.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyUp={handleKeyPress}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Security Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon />
                    </div>
                    <input
                      type="password"
                      className="w-full pl-10 pr-4 py-4 bg-gray-800/80 backdrop-blur-sm text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400 transition-all duration-300 group-hover:bg-gray-800/90"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyUp={handleKeyPress}
                      required
                    />
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${
                    isLoading ? "cursor-not-allowed opacity-75" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <AdminIcon />
                      Access Admin Dashboard
                    </>
                  )}
                </button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-amber-300 font-semibold text-sm">Security Notice</span>
                </div>
                <p className="text-amber-200 text-sm">
                  This is a restricted area. All login attempts are monitored and logged for security purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-400">
            <p className="text-sm">
              Administrator Portal • InQuizitive Club Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;