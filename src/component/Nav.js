import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const NavBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [teamname, setTeamname] = useState('');
  const [teamleademailid, setTeamleademailid] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const { data } = await axios.get('https://inquizitive-web.onrender.com/users/readtoken', { withCredentials: true });
  //       if (data.success) {
  //         setUser(data.success);
  //       }
  //     } catch (error) {
  //       console.error('Error checking authentication:', error);
  //     }
  //   };
  //   checkAuth();
  // }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleQuizRoomClick = () => {
    setShowVerification(true);
  };

  const handleLogout = async () => {
    try {
      await axios.get('https://inquizitive-web.onrender.com/users/logout', { withCredentials: true });
      setUser(null);
      navigate('/');
    } catch (error) {
      toast.error("Error logging out: " + error.message);
    }
  };

  const togglePopup = () => {
    setShowVerification(!showVerification);
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const accessingQuizRoom = async (e) => {
    e.preventDefault();
    console.log("Accessing room")
    setIsSubmitting(true);
    setQuizAttempts((prev) => prev + 1);

    const data = { teamname, teamleademailid, attempts: quizAttempts };
    console.log(data);
    try {
      const response = await axios.post(
        'https://inquizitive-web.onrender.com/events/accessingquizroom',
        { data },
        { withCredentials: true }
      );

      if (response.status === 200) {

        if(response.data.ok)
        toast.success("Success: " + response.data.message);
        else
        toast.success("You already have the code")

        navigate(`/Timer?token=${teamleademailid}`);
      } else {
        toast.error("There was an issue with your request.");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred: " + error.message);
      setIsSubmitting(false);
    }
  };

  const debouncedAccessingQuizRoom = (e) => {
    e.preventDefault(); // Prevent default immediately
    debounce(() => accessingQuizRoom(e), 350)();
  };

  return (
    <nav className="bg-transparent container mx-auto p-6 flex justify-between items-center">
      <div onClick={()=>handleNavigation('/')} className="flex items-center space-x-4 text-white">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          <img src='/images/Club_logo.JPG.png' alt="InQuizitive Logo" className="w-full h-full object-cover" />
        </div>
        <div className="border-l-2 border-white pl-4">
          <span className="block font-bold text-3xl">InQuizitive</span>
          <span className="block text-xl">IIIT Dharwad</span>
        </div>
      </div>

      <div className="hidden md:flex space-x-6">
        <ul className="flex space-x-10">
          <button onClick={() => handleNavigation('/')} className="text-gray-200 hover:text-white">Home</button>
          <button onClick={handleQuizRoomClick} className="text-gray-200 hover:text-white">Quiz Room</button>
          {/* <button onClick={() => handleNavigation('/Adminlogin')} className="text-gray-200 hover:text-white">Admin</button> */}
          <button onClick={() => handleNavigation('/event')} className="text-gray-200 hover:text-white">Event</button>
          <button onClick={() => handleNavigation('/About_us')} className="text-gray-200 hover:text-white">About Us</button>
          {/* <button onClick={() => window.location.href = '#myprofile'} className="text-gray-200 hover:text-white">My Profile</button> */}
        </ul>
      </div>

      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-gray-200 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black bg-opacity-90 flex flex-col items-center space-y-4 py-4">
          <button onClick={() => handleNavigation('/')} className="text-gray-200 hover:text-white">Home</button>
          <button onClick={handleQuizRoomClick} className="text-gray-200 hover:text-white">Quiz Room</button>
          {/* <button onClick={() => handleNavigation('/Adminlogin')} className="text-gray-200 hover:text-white">Admin</button> */}
          <button onClick={() => handleNavigation('/event')} className="text-gray-200 hover:text-white">Event</button>
          <button onClick={() => handleNavigation('/About_us')} className="text-gray-200 hover:text-white">About Us</button>
          {/* <button className="text-gray-200 hover:text-white">My Profile</button> */}
        </div>
      )}

      <div className="space-x-2 hidden md:block">
        {user ? (
          <ul className="flex items-center space-x-2">
            <span>{user.email}</span>
            <button onClick={handleLogout} className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">Logout</button>
          </ul>
        ) : (
          <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800" onClick={() => handleNavigation('/Clientlogin')}>Login/SignUp</button>
        )}
      </div>

      {showVerification && (
        <div className="bg-black bg-opacity-80 fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-transparent p-6 rounded-lg w-full max-w-md relative">
            <button className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-700" onClick={togglePopup}>
              &times;
            </button>
            <h2 className="text-4xl text-white font-bold mb-4 text-center">Quiz Room</h2>
            <form className="space-y-4" onSubmit={debouncedAccessingQuizRoom}>
              <div>
                <label className="text-white text-xl block font-semibold mb-2">Team Name</label>
                <input
                  type="text"
                  value={teamname}
                  className="text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your team name"
                  onChange={handleInputChange(setTeamname)}
                  required
                />
              </div>
              <div>
                <label className="text-white text-xl block font-semibold mb-2">Team Lead Email ID</label>
                <input
                  type="email"
                  value={teamleademailid}
                  className="text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the team lead's email"
                  onChange={handleInputChange(setTeamleademailid)}
                  required
                />
              </div>
              <button type="submit" className="w-full bg-black text-gray-300 px-4 py-2 rounded-md hover:text-white" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
            <Toaster position="top-right" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
