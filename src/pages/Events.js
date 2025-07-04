import React from 'react';
import Masonry from 'react-masonry-css';

import NavBar from '../component/NavBar.js'; 
import Footer from '../component/Footer.js'; 
import EventCard from '../component/EventCard.js';

// --- A proper data structure for your events ---
// This is much better than a simple image array. It gives context!
const eventsData = [
  {
    id: 1,
    title: "Intra-IIITD QuizFest '23",
    category: "Annual Event",
    imageUrl: "/images/DSC_1.JPG",
    description: "Our flagship internal quizzing competition."
  },
  {
    id: 2,
    title: "Freshers' Welcome",
    category: "Community",
    imageUrl: "/images/DSC_9.JPG",
    description: "Introducing new students to the world of trivia."
  },
  {
    id: 3,
    title: "Tech-Quiz Finals",
    category: "Competition",
    imageUrl: "/images/DSC_3.JPG",
    description: "The intense final round of our tech-themed quiz."
  },
  {
    id: 4,
    title: "Strategy Session",
    category: "Workshop",
    imageUrl: "/images/DSC_2.JPG",
    description: "Preparing our teams for national competitions."
  },
  {
    id: 5,
    title: "Award Ceremony",
    category: "Celebration",
    imageUrl: "/images/DSC_8.JPG",
    description: "Celebrating the winners and participants."
  },
  {
    id: 6,
    title: "A Lively Debate",
    category: "Discussion",
    imageUrl: "/images/DSC_5.JPG",
    description: "Knowledge sharing and spirited discussions."
  },
  {
    id: 7,
    title: "Audience Participation",
    category: "Interactive",
    imageUrl: "/images/DSC_7.JPG",
    description: "Engaging the crowd with fun mini-quizzes."
  },
   {
    id: 8,
    title: "Group Collaborations",
    category: "Team Building",
    imageUrl: "/images/DSC_11.jpg",
    description: "Fostering teamwork through collaborative challenges."
  },
   {
    id: 8,
    title: "Group Collaborations",
    category: "Team Building",
    imageUrl: "/images/DSC_11.jpg",
    description: "Fostering teamwork through collaborative challenges."
  },
   {
    id: 8,
    title: "Group Collaborations",
    category: "Team Building",
    imageUrl: "/images/DSC_11.jpg",
    description: "Fostering teamwork through collaborative challenges."
  },
   {
    id: 8,
    title: "Group Collaborations",
    category: "Team Building",
    imageUrl: "/images/DSC_11.jpg",
    description: "Fostering teamwork through collaborative challenges."
  },
];

const breakpointColumnsObj = {
  default: 3,   
  1100: 2,      
  700: 2,       
  500: 1        
};

const EventsPage = () => {
  return (
    <div className="bg-[#1a0e2e] text-white">
      <NavBar />

      <main>
        {/* Section 1: Hero */}
        <section 
            className="relative py-28 md:py-40 flex items-center justify-center text-center bg-cover bg-center" 
            style={{ backgroundImage: `url('/images/Trivia NIGHTS (1).png')` }}
        >
            <div className="absolute inset-0 bg-[#1a0e2e]/70 backdrop-blur-sm"></div>
            <div className="relative z-10 px-4">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">Our Event Gallery</h1>
                <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                    A look back at the moments that define the InQuizitive Club.
                </p>
            </div>
        </section>

        {/* Section 2: Masonry Photo Gallery */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {/* Map over the structured data and render a card for each event */}
              {eventsData.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </Masonry>
          </div>
        </section>

        {/* Section 3: Call to Action */}
         <section className="py-24 bg-gradient-to-t from-[#1a0e2e] to-[#2e1a47] text-center">
             <div className="container mx-auto px-6">
                 <h2 className="text-4xl font-bold mb-4">Want to be in our next photo?</h2>
                 <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">Don't miss out on our upcoming events. Register now and become a part of our growing story!</p>
                  <a href="/" className="bg-yellow-400 text-black font-bold px-8 py-4 rounded-full transition-transform duration-300 hover:scale-105 shadow-lg shadow-yellow-500/20">
                    Meet the Team
                </a>
             </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventsPage;