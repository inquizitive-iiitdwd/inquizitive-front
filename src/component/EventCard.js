// Located in: src/components/EventCard.jsx

import React from 'react';

const EventCard = ({ event }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-lg transform transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/20 mb-8"> {/* Increased margin-bottom */}
      <img 
        src={event.imageUrl} 
        alt={event.title} 
        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

      <div className="absolute bottom-0 left-0 p-6 text-white">
        <span className="bg-yellow-400 text-black text-xs font-bold uppercase px-2 py-1 rounded">
          {event.category}
        </span>
        {/* --- CHANGES ARE HERE --- */}
        <h3 className="text-3xl font-bold mt-2">{event.title}</h3> {/* Was text-2xl */}
        <p className="text-gray-200 text-base mt-1">{event.description}</p> {/* Was text-sm */}
      </div>
    </div>
  );
};

export default EventCard;