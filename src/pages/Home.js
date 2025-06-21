import React, { useState } from 'react';
import { FaExternalLinkAlt, FaBolt, FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NavBar from '../component/NavBar.js';
import Footer from '../component/Footer.js';
import Eventregistration from '../component/eventRegistration.js';
import ClubGallery from '../component/ClubGallery.js';

// Your existing image array
const images = [
    'https://theory.tifr.res.in/~mukhi/Music/Images/kg-concert10.jpg',
    'https://karnatakatourism.org/wp-content/uploads/2020/05/Dharwad-Fort.jpg',
    'https://cdn.pixabay.com/photo/2014/07/23/08/12/sandstone-399959_1280.jpg',
    'https://images.unsplash.com/photo-1582870495095-bfe299c87a3b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8a2FybmF0YWthfGVufDB8fDB8fHww',
    'https://cdn1.byjus.com/wp-content/uploads/2018/11/free-ias-prep/2018/03/02054521/Dandimarch-300x207.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_Ms2o5hCSsuXgYNNLuWtbFr-JTfVSXlHkiw&s',
    'https://assets.mysticamusic.com/images/artist-photos/mallikarjun-mansoor.jpg'
];

const Home = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => setIsOpen(!isOpen);
    const handleNavigation = (path) => navigate(path);

    // Note: The commented-out useEffect for auth is kept as is.
    // useEffect(() => { ... });

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

                {/* What's Happening Section (Events & QotW) */}
                <section className="py-16 px-4">
                    <div className="container mx-auto">
                        <h2 className="text-4xl font-bold text-center mb-12">What's Happening</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

                            {/* Upcoming Event Card */}
                            <div className="relative group flex flex-col justify-end min-h-[450px] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: `url('/images/Trivia NIGHTS (1).png')` }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="relative p-8 text-white z-10">
                                    <h3 className="text-3xl font-bold mb-3">Upcoming Event: Trivia Night</h3>
                                    <p className="text-lg text-gray-300 mb-6">
                                        Join our premier event to test your wits, connect with fellow quizzers, and expand your knowledge.
                                    </p>
                                    <button
                                        onClick={togglePopup}
                                        className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-lg transition-colors duration-300 hover:bg-gray-200"
                                    >
                                        Register Now <FaExternalLinkAlt />
                                    </button>
                                </div>
                            </div>

                            {/* Question of the Week Card */}
                            <div className="flex flex-col justify-center bg-[#1e103a]/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-white/10">
                                <div className="text-center mb-6">
                                    <FaQuestionCircle className="text-5xl text-yellow-400 mx-auto mb-4" />
                                    <h3 className="text-3xl font-bold">Question of the Week</h3>
                                </div>
                                <p className="text-xl text-gray-200 text-center leading-relaxed">
                                    What is the theme for the 12th National Sports Day being celebrated on 29th August 2024, in honor of Major Dhyan Chand's birthday?
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Image Gallery Marquee */}
                <ClubGallery />
            </main>

            {/* Registration Popup Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white text-black p-6 rounded-lg w-full max-w-md relative shadow-2xl">
                        <button
                            className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-800"
                            onClick={togglePopup}
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-center">Register for an Event</h2>
                        <Eventregistration />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Home;