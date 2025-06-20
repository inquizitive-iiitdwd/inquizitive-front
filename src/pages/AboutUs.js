import React from 'react';
import Footer from '../component/Footer.js'; // Assuming new folder structure
import NavBar from '../component/NavBar.js';
import { FaLinkedin } from 'react-icons/fa';
import { BsBinocularsFill, BsTrophyFill, BsPeopleFill } from 'react-icons/bs';

// --- Team Member Data ---
// Cleaned up, with correct image paths and removed duplicates.
const members = [
  { name: "Aditya Raj", position: "Ex-President", imageUrl: "/images/ClubMembers/AdityaRaj.jpg", linkedinUrl: "#" }, // Replace '#' with actual URLs
  { name: "Aditya Vikram Singh", position: "Ex-VicePresident", imageUrl: "/images/ClubMembers/AdityaVikramSingh.jpg", linkedinUrl: "#" },
  { name: "Niharika", position: "Core-Quiz-Team Lead", imageUrl: "/images/ClubMembers/Niharika.jpg", linkedinUrl: "#" },
  { name: "Sai", position: "Quiz Team", imageUrl: "/images/question-numbers3.jpg", linkedinUrl: "#" },
  { name: "Bhargav Abhilash", position: "President", imageUrl: "/images/ClubMembers/Abhilash.jpg", linkedinUrl: "#" },
  { name: "Sarthak Goyal", position: "Vice President", imageUrl: "/images/sarthark.jpg", linkedinUrl: "#" },
  { name: "Hardhik", position: "Social Media Team", imageUrl: "/images/question-numbers8.jpg", linkedinUrl: "#" },
  { name: "Modak", position: "Quiz Team", imageUrl: "/images/question-numbers9.jpg", linkedinUrl: "#" },
];

// --- Sub-component for Team Member Cards for cleaner code ---
const TeamMemberCard = ({ member }) => (
  <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20">
    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
    <div className="absolute bottom-0 left-0 p-6 text-white">
      <h3 className="text-2xl font-bold">{member.name}</h3>
      <p className="text-yellow-400 font-medium">{member.position}</p>
    </div>
    <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <FaLinkedin className="text-white text-4xl" />
    </a>
  </div>
);

// --- The Main Page Component ---
const AboutUsPage = () => {
  return (
    <div className="bg-[#1a0e2e] text-white">
      <NavBar />

      <main>
        {/* Section 1: Hero */}
        <section className="relative h-[60vh] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: `url('/images/DSC_3.JPG')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0e2e] via-[#2e1a47]/80 to-transparent"></div>
            <div className="relative z-10 px-4">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">About InQuizitive</h1>
                <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                    The heart of quizzing culture at IIIT Dharwad.
                </p>
            </div>
        </section>

        {/* Section 2: Our Mission */}
        <section className="py-24 bg-gradient-to-b from-[#1a0e2e] to-[#2e1a47]">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                <div className="animate-fadeIn">
                    <h2 className="text-4xl font-bold text-yellow-400 mb-4">Our Mission</h2>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        InQuizitive is dedicated to fostering a vibrant quizzing culture that celebrates curiosity, encourages learning beyond the curriculum, and builds a strong community of inquisitive minds. We aim to be the platform where knowledge meets excitement.
                    </p>
                </div>
                <div>
                    <img src="/images/quiz-bulb.png" alt="Quiz Bulb" className="w-full max-w-sm mx-auto rounded-lg" />
                </div>
            </div>
        </section>
        
        {/* Section 3: Core Pillars / What we do */}
        <section className="py-24 bg-[#1a0e2e]">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold mb-16">What We Do</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="bg-slate-800/50 p-8 rounded-xl border border-white/10">
                        <BsBinocularsFill className="text-5xl text-yellow-400 mx-auto mb-6"/>
                        <h3 className="text-2xl font-bold mb-3">Foster Curiosity</h3>
                        <p className="text-gray-400">Organizing quizzes on diverse topics to spark interest and a love for learning.</p>
                    </div>
                    <div className="bg-slate-800/50 p-8 rounded-xl border border-white/10">
                        <BsTrophyFill className="text-5xl text-yellow-400 mx-auto mb-6"/>
                        <h3 className="text-2xl font-bold mb-3">Competitive Excellence</h3>
                        <p className="text-gray-400">Training and sending teams to represent our institute at national-level competitions.</p>
                    </div>
                     <div className="bg-slate-800/50 p-8 rounded-xl border border-white/10">
                        <BsPeopleFill className="text-5xl text-yellow-400 mx-auto mb-6"/>
                        <h3 className="text-2xl font-bold mb-3">Build Community</h3>
                        <p className="text-gray-400">Creating a friendly and collaborative environment for all trivia enthusiasts on campus.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 4: The Team */}
        <section className="py-24 bg-gradient-to-b from-[#1a0e2e] to-[#2e1a47]">
          <div className="container mx-auto px-6">
            <h2 className="text-5xl font-bold text-center mb-16">Meet the Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {members.map((member, index) => (
                <TeamMemberCard key={index} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Group Photo Showcase (Mandatory Feature) */}
        <section className="h-[70vh] bg-cover bg-center bg-fixed" style={{backgroundImage: `url('/images/DSC_groupphoto.JPG')`}}>
            <div className="h-full w-full flex items-center justify-center bg-black/60">
                <h2 className="text-5xl font-bold text-white text-center drop-shadow-lg">Stronger Together</h2>
            </div>
        </section>

        {/* Section 6: Join Us / CTA */}
        <section className="py-24 bg-[#1a0e2e] text-center">
             <div className="container mx-auto px-6">
                 <h2 className="text-4xl font-bold mb-4">Ready to Join the Fun?</h2>
                 <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">Follow us on our social channels or register for our next event to become a part of the InQuizitive family!</p>
                  <a href="/event" className="bg-yellow-400 text-black font-bold px-8 py-4 rounded-full transition-transform duration-300 hover:scale-105 shadow-lg shadow-yellow-500/20">
                    See Our Events
                </a>
             </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUsPage;