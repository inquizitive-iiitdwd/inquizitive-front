import React, { useEffect, useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './Nav.js';
import Footer from './footer.js';
import Eventregistration from './eventRegistration.js'
import FlipCard from './flipcard.js';

const images = [
  'https://theory.tifr.res.in/~mukhi/Music/Images/kg-concert10.jpg',
  'https://karnatakatourism.org/wp-content/uploads/2020/05/Dharwad-Fort.jpg',
  'https://cdn.pixabay.com/photo/2014/07/23/08/12/sandstone-399959_1280.jpg',
  'https://images.unsplash.com/photo-1582870495095-bfe299c87a3b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8a2FybmF0YWthfGVufDB8fDB8fHww',
  // 'https://media2.bollywoodhungama.in/wp-content/uploads/2022/09/Sunny-Leone.jpg',
  'https://cdn1.byjus.com/wp-content/uploads/2018/11/free-ias-prep/2018/03/02054521/Dandimarch-300x207.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_Ms2o5hCSsuXgYNNLuWtbFr-JTfVSXlHkiw&s',
  'https://assets.mysticamusic.com/images/artist-photos/mallikarjun-mansoor.jpg'

];

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [speed, setSpeed] = useState(20);

  const handleFlip = (index) => {
    setFlippedIndex(flippedIndex === index ? null : index);
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('https://quiz-t7o5.onrender.com/user/readtoken', { withCredentials: true });
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };
    checkAuth();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-gradient-to-r from-[#2e1a47] to-[#624a82] container mx-auto flex justify-between items-center text-white min-h-screen flex flex-col">
    <NavBar />
    <div className="container mx-auto flex flex-col lg:flex-row items-center text-center lg:text-left py-10 px-4 lg:px-6">
      <div className="w-full  flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white-400 animate-fadeIn">
        <p>Welcome to</p> 
        </h1>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white-400 animate-fadeIn">
        <p>InQuizitive Club</p>
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-8 animate-fadeIn text-">
          Where Curiosity Meets Challenge!
        </p>
        <div className="space-x-4">
          <button
            onClick={() => handleNavigation("/buzzer")}
            className="bg-black text-white px-6 py-3 rounded-lg transition transform duration-300 hover:bg-white-400 hover:scale-105"
          >
            Buzzer Room
          </button>
          <button
            onClick={() => handleNavigation("/classroom")}
            className="bg-white text-black px-6 py-3 rounded-lg transition transform duration-300 hover:bg-gray-300 hover:scale-105"
          >
            Class Room
          </button>
        </div>
      </div>
    </div>

    {/* Question of the Week Section */}
    <section className="bg-gradient-to-r from-[#2e1a47] to-[#624a82] py-12 my-8 max-w-[60%] px-5 rounded-lg shadow-xl animate-slideIn my-12">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl text-white font-bold mb-4">Question of the Week</h2>
        <p className="text-xl text-white">What is the theme for the 12th National Sports Day being celebrated on 29th August 2024, in honor of Major Dhyan Chand's birthday?</p>
      </div>
    </section>

      {/* Upcoming Events Section */}
      <section
        className="relative py-12 px-10 mx-5 mt-4 h-800 shadow-xl rounded-lg overflow-hidden"
        style={{
         backgroundImage: `url('/images/Trivia NIGHTS (1).png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",

        }}
      >
     <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Join our events to connect with others and expand your knowledge.
          </p>
          <button
            className="bg-white text-black px-6 py-3 rounded-lg flex items-center justify-center mx-auto hover:bg-gray-300"
            style={{ maxWidth: "200px" }}
          >
          <span className="mr-2 text-black" onClick={togglePopup}>Register</span>
          <FaExternalLinkAlt />
        </button>
      </div>
    </section>
    {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-yellow p-6 rounded-lg w-full max-w-md relative">
            <button
              className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-700"
              onClick={togglePopup}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
            <Eventregistration/>
          </div>
        </div>
      )}

      {/* Image Gallery */}
      
      <div
      className="marquee-container overflow-hidden whitespace-nowrap relative flex items-center h-96 w-full"
      style={{
        '--marquee-speed': `${speed}s`,
      }}
    >
      <div
        className="marquee-content flex animate-marquee"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="marquee-item flex-shrink-0 w-72 h-80 mr-5 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
          >
            <img
              src={image}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        ))}
      </div>
      <div
        className="marquee-content flex animate-marquee"
        onMouseLeave={() => setSpeed(20)}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="marquee-item flex-shrink-0 w-72 h-80 mr-5 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
          >
            <img
              src={image}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        ))}
      </div>
    </div>

      {/* <FlipCard /> */}
      <Footer />
    </div>
  );
};

export default Home;
