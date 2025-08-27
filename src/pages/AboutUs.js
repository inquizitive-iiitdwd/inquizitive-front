import React from "react";
import Footer from "../component/Footer.js";
import NavBar from "../component/NavBar.js";
import { FaLinkedin } from "react-icons/fa";
import { BsBinocularsFill, BsTrophyFill, BsPeopleFill } from "react-icons/bs";
import members from "../data/aboutusData.js";

const TeamMemberCard = ({ member }) => (
  <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20">
    <img
      src={member.imageUrl}
      alt={member.name}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
    <div className="absolute bottom-0 left-0 p-6 text-white">
      <h3 className="text-2xl font-bold">{member.name}</h3>
      <p className="text-yellow-400 font-medium">{member.position}</p>
    </div>
    <a
      href={member.linkedinUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    >
      <FaLinkedin className="text-white text-4xl" />
    </a>
  </div>
);

// --- The Main Page Component ---
const AboutUsPage = () => {
  // --- Data filtering logic ---
  // Group 1: Mentors (Past Leaders)
  const exLeaders = members.filter(
    (m) => m.position === "Ex-President" || m.position === "Ex-VicePresident"
  );

  // Group 2: Current Leadership
  const currentLeaders = members.filter(
    (m) => m.position === "President" || m.position === "Vice President"
  );

  // Group 3: The rest of the team members
  const coreTeam = members.filter(
    (m) =>
      m.position !== "Ex-President" &&
      m.position !== "Ex-VicePresident" &&
      m.position !== "President" &&
      m.position !== "Vice President"
  );

  return (
    <div className="bg-[#1a0e2e] text-white">
      <NavBar />

      <main>
        {/* Section 1: Hero */}
        <section
          className="relative h-[60vh] flex items-center justify-center text-center bg-cover bg-center"
          style={{ backgroundImage: `url('/images/DSC_3.JPG')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0e2e] via-[#2e1a47]/80 to-transparent"></div>
          <div className="relative z-10 px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              About InQuizitive
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              The heart of quizzing culture at IIIT Dharwad.
            </p>
          </div>
        </section>

        {/* Section 2: Our Mission */}
        <section className="py-24 bg-gradient-to-b from-[#1a0e2e] to-[#2e1a47]">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-fadeIn">
              <h2 className="text-4xl font-bold text-yellow-400 mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                InQuizitive is dedicated to fostering a vibrant quizzing culture
                that celebrates curiosity, encourages learning beyond the
                curriculum, and builds a strong community of inquisitive minds.
                We aim to be the platform where knowledge meets excitement.
              </p>
            </div>
            <div>
              <img
                src="/images/quiz_hanging-landscape.png"
                alt="Quiz Bulb"
                className="w-full max-w-sm mx-auto rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Core Pillars / What we do */}
        <section className="py-24 bg-[#1a0e2e]">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-16">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-slate-800/50 p-8 rounded-xl border border-white/10">
                <BsBinocularsFill className="text-5xl text-yellow-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-3">Foster Curiosity</h3>
                <p className="text-gray-400">
                  Organizing quizzes on diverse topics to spark interest and a
                  love for learning.
                </p>
              </div>
              <div className="bg-slate-800/50 p-8 rounded-xl border border-white/10">
                <BsTrophyFill className="text-5xl text-yellow-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-3">
                  Competitive Excellence
                </h3>
                <p className="text-gray-400">
                  Training and sending teams to represent our institute at
                  national-level competitions.
                </p>
              </div>
              <div className="bg-slate-800/50 p-8 rounded-xl border border-white/10">
                <BsPeopleFill className="text-5xl text-yellow-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-3">Build Community</h3>
                <p className="text-gray-400">
                  Creating a friendly and collaborative environment for all
                  trivia enthusiasts on campus.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Section 4: The Team --- */}
        <section className="py-24 bg-gradient-to-b from-[#1a0e2e] to-[#2e1a47]">
          <div className="container mx-auto px-6">
            <h2 className="text-5xl font-bold text-center mb-16">
              Meet the Team
            </h2>

            {/* Row 1: Ex-Leaders */}
            <div className="mb-20">
              <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400/90">
                Our Mentors
              </h3>
              <div className="flex flex-wrap justify-center items-center gap-8">
                {exLeaders.map((member) => (
                  <div key={member.name} className="w-full max-w-[280px]">
                    <TeamMemberCard member={member} />
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Current Leaders */}
            <div className="mb-20">
              <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400/90">
                Current Leadership
              </h3>
              <div className="flex flex-wrap justify-center items-center gap-8">
                {currentLeaders.map((member) => (
                  <div key={member.name} className="w-full max-w-[280px]">
                    <TeamMemberCard member={member} />
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: The Rest of the Team */}
            <div>
              <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400/90">
                Core Team
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
                {coreTeam.map((member) => (
                  <div key={member.name} className="w-full max-w-[280px]">
                    <TeamMemberCard member={member} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Group Photo Showcase */}
        <section
          className="h-[70vh] bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('/images/inquizitive_groupphoto.jpg')`,
          }}
        >
          <div className="h-full w-full flex items-center justify-center bg-black/60">
            <h2 className="text-5xl font-bold text-white text-center drop-shadow-lg">
              Stronger Together
            </h2>
          </div>
        </section>

        {/* Section 6: Join Us / CTA */}
        <section className="py-24 bg-[#1a0e2e] text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-4">Ready to Join the Fun?</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Follow us on our social channels or register for our next event to
              become a part of the InQuizitive family!
            </p>
            <a
              href="/event"
              className="bg-yellow-400 text-black font-bold px-8 py-4 rounded-full transition-transform duration-300 hover:scale-105 shadow-lg shadow-yellow-500/20"
            >
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
