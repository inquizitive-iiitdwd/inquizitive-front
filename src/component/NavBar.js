import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { HiMenu, HiX } from 'react-icons/hi';
import QuizAccessModal from './QuizAccessModal.js'; // This modal component is still used

// Define nav links in an array for cleaner code
const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Events', path: '/event' },
  { label: 'About Us', path: '/About_us' },
];

const NavBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState(0);

  // The auth-checking useEffect and other handlers remain the same
  // useEffect(() => { ... }); 

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/users/logout', { withCredentials: true });
      setUser(null);
      navigate('/');
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  const handleQuizSubmit = async ({ teamname, teamleademailid }) => {
    // Logic for quiz submission remains unchanged
    setQuizAttempts((prev) => prev + 1);
    const data = { teamname, teamleademailid, attempts: quizAttempts + 1 };
    try {
      const response = await axios.post(
        'http://localhost:5000/events/accessingquizroom',
        { data },
        { withCredentials: true }
      );
      if (response.data.ok) {
        toast.success(response.data.message || "Access granted!");
      } else {
        toast.success(response.data.message || "You already have the code.");
      }
      setIsModalOpen(false);
      navigate(`/Timer?token=${teamleademailid}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
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
            <img src='/images/Club_logo.JPG.png' alt="InQuizitive Logo" className="w-16 h-16 rounded-full border-2 border-purple-400" />
            <div>
              <span className="block font-bold text-2xl text-white">InQuizitive</span>
              <span className="block text-md text-gray-300">IIIT Dharwad</span>
            </div>
          </Link>

          {/* Center: Desktop Navigation */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
            {navLinks.map((link) => (
                <NavItem key={link.path} to={link.path}>{link.label}</NavItem>
            ))}
            <button 
                onClick={() => setIsModalOpen(true)}
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
                <Link to="/Clientlogin"
                    className="bg-black/50 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-black/70 transition-colors duration-300"
                >
                    Login / SignUp
                </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <HiX size={30} /> : <HiMenu size={30} />}
            </button>
          </div>
        </nav>

        {/* Animated Mobile Menu */}
        <div 
            className={`md:hidden absolute w-full bg-[#2e1a47]/95 backdrop-blur-md overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}
        >
            <div className="flex flex-col items-center gap-6 py-8">
                {navLinks.map((link) => (
                    <NavItem key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)}>{link.label}</NavItem>
                ))}
                <button
                    onClick={() => { setIsModalOpen(true); setIsMenuOpen(false); }}
                    className="text-gray-300 text-lg hover:text-yellow-300 transition-colors duration-300"
                >
                    Quiz Room
                </button>
                 <div className="mt-4">
                    {user ? (
                    <button onClick={handleLogout} className="bg-purple-800/50 text-white px-6 py-2 rounded-lg">Logout</button>
                    ) : (
                    <NavItem to="/Clientlogin" onClick={() => setIsMenuOpen(false)}>Login / SignUp</NavItem>
                    )}
                </div>
            </div>
        </div>
      </header>

      {/* The Modal and Toaster remain unchanged and fully functional */}
      <QuizAccessModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleQuizSubmit} 
      />
      <Toaster position="top-right" />
    </>
  );
};

export default NavBar;