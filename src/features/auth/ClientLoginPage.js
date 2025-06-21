import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Nav from '../../component/NavBar.js';

// SVG Icons for a cleaner look without extra dependencies
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const ClientLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // **NEW**: Check for messages from other pages (e.g., email verification)
  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'success') {
      toast.success('Email verified successfully! Please log in.');
      // Clean the URL
      navigate('/Clientlogin', { replace: true });
    } else if (message === 'already-verified') {
      toast.info('Your email was already verified. Please log in.');
      navigate('/Clientlogin', { replace: true });
    }
  }, [searchParams, navigate]);


  const handleNavigate = (e, path) => {
    e.preventDefault();
    navigate(path);
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please enter both email and password.");
    }
    
    setIsLoading(true);
    try {
      // **CHANGED**: The payload is now a flat object, not nested under `data`.
      const credentials = { email, password };
      const response = await axios.post("http://localhost:5000/users/login", credentials, { withCredentials: true });

      if (response.status === 200) {
        toast.success("Signed in successfully!");
        // The secure httpOnly cookie is set by the browser automatically.
        // We just need to navigate to the main page.
        navigate('/');
      }
    } catch (error) {
      // **CHANGED**: Display the specific error message from the backend.
      const errorMessage = error.response?.data?.error || "Login failed. Please try again.";
      toast.error(errorMessage);
      console.error("Error logging in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='relative min-h-screen bg-gradient-to-r from-[#2e1a47] to-[#624a82] font-sans'>
      <Nav/>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-[#2e1a47] bg-opacity-40 p-8 rounded-xl shadow-2xl w-full max-w-md border border-purple-400/30">
          <Toaster position="top-center" reverseOrder={false} />
          
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col space-y-6">
            {/* Email Input */}
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
                required
                autoComplete="email"
              />
            </div>
            
            {/* Password Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockIcon />
              </span>
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 text-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            
            <button
              type="submit"
              className={`w-full px-4 py-3 bg-green-600 text-white rounded-lg font-bold transition duration-300 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center ${isLoading ? 'cursor-not-allowed opacity-75' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                'Login'
              )}
            </button>
            
            <div className="text-center text-gray-300 text-sm space-y-2 pt-4">
              <p>
                Don't have an account?{' '}
                <a href="/sign" className="text-green-400 font-bold hover:underline" onClick={(e) => handleNavigate(e, '/sign')}>
                  Sign up
                </a>
              </p>
              <p>
                <a href="/Resetpassword" className="text-green-400 font-bold hover:underline" onClick={(e) => handleNavigate(e, '/Resetpassword')}>
                  Forgot Password?
                </a>
              </p>
            </div>
          </form>
        </div>
        
        <footer className="absolute bottom-4 w-full text-center text-white/60 z-10 text-sm">
          Created by <a href="https://github.com/maheshkatyayan" className="text-green-400 font-semibold hover:underline">codecraftmen</a>
        </footer>
      </div>
    </div>
  );
};

export default ClientLoginPage;