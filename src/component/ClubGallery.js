import React from 'react';
// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Icon import
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Same meaningful placeholder data
const moments = [
    {
        image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        title: "Annual Tech-Fest Quiz '23",
        description: "Fierce competition and brilliant minds at our flagship event.",
    },
    {
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        title: "Freshers' Welcome Quiz",
        description: "Introducing the newest members to the world of quizzing.",
    },
    {
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        title: "Freshers' Welcome Quiz",
        description: "Introducing the newest members to the world of quizzing.",
    },
    {
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        title: "Freshers' Welcome Quiz",
        description: "Introducing the newest members to the world of quizzing.",
    },
    {
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        title: "Freshers' Welcome Quiz",
        description: "Introducing the newest members to the world of quizzing.",
    },
    {
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        title: "Freshers' Welcome Quiz",
        description: "Introducing the newest members to the world of quizzing.",
    },
];

const ClubGallery = () => {
    return (
        <section className="py-24 w-full bg-[#1a0e2e]">
            <div className="container mx-auto text-center px-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wide">
                    Moments & Memories
                </h2>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-16">
                    A glimpse into the life, events, and achievements of the InQuizitive Club.
                </p>
            </div>
            
            {/* Swiper container now has more padding to allow for reflections and shadows */}
            <div className="relative max-w-7xl mx-auto px-4">
                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    loop={true}
                    slidesPerView={1} // Start with 1 on mobile
                    spaceBetween={0}
                    coverflowEffect={{
                        rotate: 0,       // Keep rotation minimal for a sleeker look
                        stretch: 80,    // Space between slides
                        depth: 200,      // 3D depth effect
                        modifier: 1,      // Effect multiplier
                        slideShadows: false, // We'll add our own glow
                    }}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                    }}
                    pagination={{ el: '.swiper-pagination', clickable: true }}
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                    // Responsive breakpoints
                    breakpoints={{
                        768: {
                          slidesPerView: 2, // 2 slides for tablets
                          spaceBetween: 100,
                        },
                        1024: {
                          slidesPerView: 3, // 3 slides for desktop
                          spaceBetween: 150,
                        },
                    }}
                    className="pb-20" // Add padding to the bottom for pagination and reflection
                >
                    {moments.map((moment, index) => (
                        <SwiperSlide key={index} className="group">
                             {/* The main slide content */}
                            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-visible">
                                <img src={moment.image} alt={moment.title} className="w-full h-full object-cover rounded-2xl transition-all duration-500 group-[.swiper-slide-active]:grayscale-0 grayscale opacity-50 group-[.swiper-slide-active]:opacity-100" />
                                
                                {/* Text overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end rounded-2xl transition-opacity duration-500 opacity-0 group-[.swiper-slide-active]:opacity-100">
                                    <h3 className="text-2xl font-bold text-white">{moment.title}</h3>
                                    <p className="text-sm text-gray-200 mt-1">{moment.description}</p>
                                </div>

                                {/* Active slide glow effect */}
                                <div className="absolute inset-0 rounded-2xl ring-4 ring-yellow-400/70 shadow-2xl shadow-yellow-400/40 transition-all duration-500 opacity-0 group-[.swiper-slide-active]:opacity-100 scale-95 group-[.swiper-slide-active]:scale-100"></div>
                            </div>

                            {/* Reflection Effect */}
                            <div className="absolute top-full left-0 w-full h-2/3 mt-2 bg-transparent overflow-hidden transition-opacity duration-500 opacity-0 group-[.swiper-slide-active]:opacity-100">
                                <img src={moment.image} alt="" className="w-full h-full object-cover rounded-2xl transform -scale-y-100" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0e2e] via-[#1a0e2e]/70 to-[#1a0e2e]"></div>
                            </div>
                        </SwiperSlide>
                    ))}
                    
                    {/* The centered pagination container */}
                    <div className="swiper-pagination"></div>

                </Swiper>
                
                {/* Navigation arrows positioned absolutely to the container */}
                <div className="swiper-button-prev absolute left-0 md:-left-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-white">
                    <FaArrowLeft size={24}/>
                </div>
                <div className="swiper-button-next absolute right-0 md:-right-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-white">
                    <FaArrowRight size={24}/>
                </div>
            </div>
        </section>
    );
};

export default ClubGallery;