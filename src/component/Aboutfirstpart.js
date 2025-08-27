import React, { useState, useEffect } from "react";
import { useGlobalcontext } from "../context/QuizContext.js";



const Aboutfirstpart = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');
  const { members } = useGlobalcontext();

  const images = [
    '/images/DSC_1.JPG',
    '/images/DSC_2.JPG',
    '/images/DSC_3.JPG',
    '/images/DSC_4.JPG',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change the image every 5 seconds (increase the interval)

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [images.length]);



  return (
    <div>
      
      <div className=" mb-40 mx-auto px-4 pt-8 pb-40 min-h-screen">
     
      <div>
      <section
style={{
  height: "350px",
  width: "100%",
  backgroundImage: `url('/images/DSC_groupphoto.JPG')`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundBlendMode: "overlay",
}}>
<div className="absolute inset-0"></div>
<div className="flex items-end justify-center text-white h-full">
  <h2 className="text-6xl font-bold mb-4 ">Amat Victoria Curam</h2>
</div>
</section>
      </div>
      
        <div className="relative py-12 px-10 mx-5 mt-4 h-800 shadow-xl rounded-lg overflow-hidden flex flex-row text-white">
          <div className="lg:w-1/2">
            <h2 className=" text-3xl mb-4 animate-fadeInLeft">
              What is InQuizitive all about?
            </h2>
            <p className="mb-4 animate-fadeIn">
              Well, your first thoughts might be like, "They are just a bunch of
              geeks who read books and acquire knowledge on some random stuff
              all the time, and some might even think about the Theory of
              Relativity or Thermodynamics and entropy all the time...". You are
              right but not totally. We never take a break from gaining random
              knowledge but, knowing some stuff that no one else does make you
              cool right? Preparing, conducting, and participating in a wide
              range of quizzes gives you exactly what you need to be called a
              "cool university student".
            </p>
            <p className="mb-4 animate-fadeIn">
              Hence, InQuizitive always gives you such great opportunities by
              hosting Trivia nights and other fun quiz competitions, also
              shaping you to compete with other well-rounded bookworms out
              there. So, join us at our events where we will promise to provide
              you a platform for you to shine.
            </p>
          </div>

          <div className="slider-container lg:w-1/2  lg:mt-0 lg:ml-20">
            <div   className={`slide ${slideDirection}`}
        key={currentIndex}
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
        }}></div>
          </div>
        </div>

        <div className="relative py-12 px-10 mx-5 mt-4 h-800 shadow-xl rounded-lg overflow-hidden text-white">
          <h2 className="text-3xl mb-4 ">
            Find your best fit with our College Quiz!
          </h2>
          <p className="mb-4">
            Choosing a college is tough. A lot goes into the decision, and
            everyone has different priorities. You might be looking for a school
            with the best academics and top-notch professors, while your friend
            wants a great party scene in a warm climate.
          </p>
          <p className="mb-4">
            And let's be honest — not everyone knows what they want in a school
            right away. Your parents and teachers want you to get into a “good
            college,” but have you thought about what that means? If the answer
            is no, don't worry — you're not alone.
          </p>
          <p className="mb-4">
            That's why Niche created the College Quiz, a quick and easy survey
            that zeroes in on what matters to you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Aboutfirstpart;
