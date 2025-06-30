import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../services/api.js';
import toast, { Toaster } from 'react-hot-toast';
import Nav from '../component/NavBar.js';

// --- Reusable SVG Icons ---
const MailIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg> );
const LockIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> );
const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );
const PhoneIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> );

// Component renamed to be more descriptive
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword, phoneNumber, name } = formData;

    if (!email || !password || !confirmPassword || !phoneNumber || !name) {
      return toast.error("Please fill in all fields.");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setIsLoading(true);
    try {
      // **CHANGED**: Prepare the correct payload (flat object)
      const payload = { email, password, phone_number: phoneNumber, name };
      
      // **CHANGED**: Use the correct endpoint `/register`
      const response = await api.post("/users/register", payload, { withCredentials: true });

      // **CHANGED**: Use the success message from the backend
      if (response.status === 201) {
        toast.success(response.data.message);
        setVerificationSent(true); // Show the success message UI
      }
    } catch (error) {
      // **CHANGED**: Use the specific error message from the backend
      const errorMessage = error.response?.data?.error || "Registration failed. Please try again.";
      toast.error(errorMessage);
      console.error("Error signing up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (name, type, placeholder, icon, autoComplete) => (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">{icon}</span>
      <input
        name={name}
        type={type}
        className="w-full pl-10 pr-4 py-3 bg-gray-900/50 text-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        autoComplete={autoComplete}
        required
      />
    </div>
  );

  return (
    <>
      <Nav />
      <div className='relative min-h-screen bg-gradient-to-r from-[#2e1a47] to-[#624a82] font-sans flex items-center justify-center p-4'>
        <Toaster position="top-center" reverseOrder={false} />

        <div className="relative bg-[#2e1a47] bg-opacity-40 p-8 rounded-xl shadow-2xl w-full max-w-md border border-purple-400/30">
          {verificationSent ? (
            <div className="text-center text-white">
              <svg className="mx-auto h-16 w-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h3 className="text-2xl font-bold mt-4">Registration Successful!</h3>
              <p className="mt-2 text-gray-300">We've sent a verification link to your email. Please check your inbox and follow the instructions to activate your account.</p>
              <button
                onClick={() => navigate('/Clientlogin')}
                className="mt-6 w-full px-4 py-3 bg-green-600 text-white rounded-lg font-bold transition hover:bg-green-700"
              >
                Proceed to Login
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-4xl font-bold text-white mb-8 text-center">
                Create Account
              </h2>
              <form onSubmit={handleRegister} className="flex flex-col space-y-5">
                {renderInput("email", "email", "College Email ID", <MailIcon />, "email")}
                {renderInput("name", "text", "Full Name", <UserIcon />, "name")}
                {renderInput("password", "password", "Password", <LockIcon />, "new-password")}
                {renderInput("confirmPassword", "password", "Confirm Password", <LockIcon />, "new-password")}
                {renderInput("phoneNumber", "tel", "Phone Number", <PhoneIcon />, "tel")}
                
                <button
                  type="submit"
                  className={`w-full px-4 py-3 bg-green-600 text-white rounded-lg font-bold transition duration-300 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center ${isLoading ? 'cursor-not-allowed opacity-75' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Registering...
                    </>
                  ) : (
                    'Register'
                  )}
                </button>
              </form>
              <div className="text-center text-gray-300 text-sm pt-6">
                <p>
                  Already have an account?{' '}
                  <a href="/Clientlogin" onClick={(e) => { e.preventDefault(); navigate('/Clientlogin'); }} className="text-green-400 font-bold hover:underline">
                    Login here
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
        <footer className="absolute bottom-4 w-full text-center text-white/60 z-10 text-sm">
          Created by <a href="https://github.com/maheshkatyayan" className="text-green-400 font-semibold hover:underline">codecraftmen</a>
        </footer>
      </div>
    </>
  );
};

export default RegisterPage;