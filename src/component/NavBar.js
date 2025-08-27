import React, { useState, useEffect } from "react";
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // --- STATE MANAGEMENT FOR THE NEW 2-STEP FLOW ---
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");

  // Fetch user data using the token
  useEffect(() => {
    console.log("NavBar useEffect triggered");
    const checkAuth = async () => {
      try {
        console.log("Checking auth...");
        // Skip auth check on reset password pages
        if (window.location.pathname.includes("/reset-password")) {
          console.log("Skipping auth check on reset password page");
          return;
        }
        const response = await api.get("/users/me", { withCredentials: true });
        console.log("User data received:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Auth check failed:", error.response?.data || error.message);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout", {}, { withCredentials: true });
      setUser(null);
      setIsProfileOpen(false);
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
        { data: { teamleademailid } },
        { withCredentials: true }
      );
      toast.success(response.data.message || "Access code sent!");

      setIsAccessModalOpen(false);
      setEmailForOtp(teamleademailid);
      setIsOtpModalOpen(true);

      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to get access code."
      );
      throw error;
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
              onClick={() => setIsAccessModalOpen(true)}
              className="text-gray-300 text-lg hover:text-yellow-300 transition-colors duration-300"
            >
              Quiz Room
            </button>
          </div>

          {/* Right: Auth Section */}
          <div className="hidden md:flex items-center relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 bg-purple-800/50 text-white p-2 rounded-full hover:text-yellow-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full border border-gray-300"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                      {user.user_name ? user.user_name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <span className="text-sm font-medium">
                    {user.email || user.user_name || "User"}
                  </span>
                </button>
                {isProfileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50"
                    style={{
                      background:
                        "linear-gradient(to bottom, #2e1a47, #624a82)",
                    }}
                  >
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <Link
                        to="/manage-account"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-white hover:text-yellow-300 transition-colors duration-300"
                        role="menuitem"
                      >
                        Manage Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:text-yellow-300 transition-colors duration-300"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
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
                setIsAccessModalOpen(true);
                setIsMenuOpen(false);
              }}
              className="text-gray-300 text-lg hover:text-yellow-300 transition-colors duration-300"
            >
              Quiz Room
            </button>
            <div className="mt-4">
              {user ? (
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 text-white"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full border border-gray-300"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                        {user.user_name ? user.user_name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {user.email || user.user_name || "User"}
                    </span>
                  </button>
                  {isProfileOpen && (
                    <div className="w-full flex flex-col items-center">
                      <Link
                        to="/manage-account"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-3/4 text-center px-4 py-2 text-sm text-white hover:text-yellow-300 transition-colors duration-300 rounded-lg"
                      >
                        Manage Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-3/4 mt-2 bg-purple-800/50 text-white px-4 py-2 rounded-lg"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
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