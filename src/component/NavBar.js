import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api.js";
import { toast, Toaster } from "react-hot-toast";
import { HiMenu, HiX } from "react-icons/hi";

// Import BOTH modals
import QuizAccessModal from "../features/quiz/components/QuizAccessModal.js";
import OtpEntryModal from "../features/quiz/components/OtpEntryModal.js";

// Define nav links in an array for cleaner code
const navLinks = [
  { label: "Home", path: "/" },
  { label: "Events", path: "/event" },
  { label: "About Us", path: "/aboutus" },
];

const NavBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- STATE MANAGEMENT FOR THE NEW 2-STEP FLOW ---
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState(""); // To pass the email to the OTP modal

  // The auth-checking useEffect can be added here if needed
  // useEffect(() => { ... });

  const handleLogout = async () => {
    try {
      await api.get("/users/logout", { withCredentials: true });
      setUser(null);
      navigate("/");
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error(`Logout failed: ${error.message || "An error occurred"}`);
    }
  };

  // --- STEP 1 HANDLER: Request the access code ---
  const handleRequestAccessCode = async ({ teamleademailid }) => {
    try {
      const response = await api.post(
        "/events/accessingquizroom",
        { data: { teamleademailid } }, // Only send the email, as per new backend
        { withCredentials: true }
      );
      toast.success(response.data.message || "Access code sent!");

      // On success, close the first modal and open the second
      setIsAccessModalOpen(false);
      setEmailForOtp(teamleademailid); // Store the email for the next step
      setIsOtpModalOpen(true);

      return true; // Signal success back to the child modal
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to get access code."
      );
      throw error; // Propagate the error to allow the modal's 'finally' block to run
    }
  };

  // --- STEP 2 HANDLER: Verify the OTP and enter the quiz ---
  const handleVerifyOtp = async ({ otp }) => {
    try {
      const response = await api.post("/events/accessingquizroombykey", {
        key: otp,
      });

      toast.success("Access Granted! Entering quiz...");
      setIsOtpModalOpen(false);

      // Navigate to the timer/quiz page, passing team data securely in the state
      navigate("/Timer", { state: { teamData: response.data.teamData } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired code.");
      throw error;
    }
  };

  const NavItem = ({ children, to, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="text-gray-300 text-lg hover:text-yellow-300 transition-colors duration-300"
    >
      {children}
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#2e1a47] to-[#624a82] shadow-lg shadow-black/20">
        <nav className="container mx-auto px-6 py-4 relative flex justify-between items-center">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <img
              src="/images/Club_logo.JPG.png"
              alt="InQuizitive Logo"
              className="w-16 h-16 rounded-full border-2 border-purple-400"
            />
            <div>
              <span className="block font-bold text-2xl text-white">
                InQuizitive
              </span>
              <span className="block text-md text-gray-300">IIIT Dharwad</span>
            </div>
          </Link>

          {/* Center: Desktop Navigation */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
            {navLinks.map((link) => (
              <NavItem key={link.path} to={link.path}>
                {link.label}
              </NavItem>
            ))}
            <button
              onClick={() => setIsAccessModalOpen(true)} // Opens the FIRST modal
              className="text-gray-300 text-lg hover:text-yellow-300 transition-colors duration-300"
            >
              Quiz Room
            </button>
          </div>

          {/* Right: Auth Button */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-white text-sm">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-purple-800/50 text-white px-5 py-2 rounded-lg hover:bg-purple-700/70 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/client-login"
                className="bg-black/50 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-black/70 transition-colors duration-300"
              >
                Login / SignUp
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <HiX size={30} /> : <HiMenu size={30} />}
            </button>
          </div>
        </nav>

        {/* Animated Mobile Menu */}
        <div
          className={`md:hidden absolute w-full bg-[#2e1a47]/95 backdrop-blur-md overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="flex flex-col items-center gap-6 py-8">
            {navLinks.map((link) => (
              <NavItem
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavItem>
            ))}
            <button
              onClick={() => {
                setIsAccessModalOpen(true); // Opens the FIRST modal
                setIsMenuOpen(false);
              }}
              className="text-gray-300 text-lg hover:text-yellow-300 transition-colors duration-300"
            >
              Quiz Room
            </button>
            <div className="mt-4">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="bg-purple-800/50 text-white px-6 py-2 rounded-lg"
                >
                  Logout
                </button>
              ) : (
                <NavItem
                  to="/client-login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login / SignUp
                </NavItem>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Render both modals, their `isOpen` state will control which one (if any) is visible */}
      <QuizAccessModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        onSubmit={handleRequestAccessCode}
      />

      <OtpEntryModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onSubmit={handleVerifyOtp}
        email={emailForOtp}
      />

      <Toaster position="top-right" />
    </>
  );
};

export default NavBar;
