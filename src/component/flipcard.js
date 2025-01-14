import React from "react";

const FlipCard = () => {
  return (
    <div className="h-400 bg-gray-200">
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front flex justify-center items-center bg-purple-500 text-white rounded-lg">
            <h1 className="text-2xl">Hey</h1>
          </div>
          <div className="flip-card-back flex justify-center items-center bg-green-500 text-white rounded-lg">
            <p className="text-xl">Did you know?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
