import React, { useState } from "react";
import {
  FaExternalLinkAlt,
  FaBolt,
  FaQuestionCircle,
  FaBrain,
  FaUsers,
  FaTrophy,
  FaStar,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavBar from "../component/NavBar.js";
import Footer from "../component/Footer.js";
import EventRegistration from "../component/EventRegistration.js";
import ClubGallery from "../component/ClubGallery.js";

const Home = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => setIsOpen(!isOpen);
  const handleNavigation = (path) => navigate(path);

  // Reusable component for the feature grid items
  const Feature = ({ icon, title, children }) => (
    <div className="bg-[#1e103a]/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/10 text-center transition-all duration-300 hover:border-yellow-400/80 hover:bg-[#2e1a47]/70 hover:scale-105">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-2 text-yellow-400">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{children}</p>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-[#2e1a47] to-[#624a82] text-white min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-center py-20 lg:py-28 px-4">
          <div className="container mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 animate-fadeIn tracking-tight">
              Welcome to InQuizitive Club
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 animate-fadeIn">
              Where Curiosity Meets Challenge!
            </p>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <button
                onClick={() => handleNavigation("/buzzer")}
                className="flex items-center gap-2 bg-yellow-400 text-black font-bold px-8 py-3 rounded-full transition-transform duration-300 hover:scale-105 hover:bg-yellow-300 shadow-lg"
              >
                <FaBolt />
                Buzzer Room
              </button>
              <button
                onClick={togglePopup}
                className="bg-white/10 border border-white/20 backdrop-blur-sm text-white font-bold px-8 py-3 rounded-full transition-transform duration-300 hover:scale-105 hover:bg-white/20 shadow-lg"
              >
                Register for Events
              </button>
            </div>
          </div>
        </section>

        {/* --- NEW CREATIVE SECTION --- */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-12">
              The InQuizitive Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Feature
                icon={<FaBrain className="text-5xl text-yellow-400" />}
                title="Sharpen Your Mind"
              >
                Boost your general knowledge, critical thinking, and
                problem-solving skills in a fun, engaging way.
              </Feature>
              <Feature
                icon={<FaTrophy className="text-5xl text-yellow-400" />}
                title="Feel the Thrill"
              >
                Experience the adrenaline of fast-paced buzzer quizzes and the
                rewarding challenge of our flagship events.
              </Feature>
              <Feature
                icon={<FaUsers className="text-5xl text-yellow-400" />}
                title="Join a Community"
              >
                Connect with fellow students who share your passion for trivia,
                teamwork, and friendly competition.
              </Feature>
              <Feature
                icon={<FaStar className="text-5xl text-yellow-400" />}
                title="Explore Domains"
              >
                From tech and business to pop culture and the arts, our quizzes
                cover a vast universe of topics.
              </Feature>
            </div>
          </div>
        </section>

        {/* Image Gallery Marquee */}
        <ClubGallery />
      </main>

      {/* Registration Popup Modal */}
      <EventRegistration isOpen={isOpen} onClose={togglePopup} />

      <Footer />
    </div>
  );
};

export default Home;
