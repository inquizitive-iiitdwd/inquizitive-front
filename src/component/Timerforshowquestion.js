import React, { useState, useEffect } from "react";
import axios from 'axios';

const Timerforshowquestion = ({ onTimerEnd }) => {
  const [time, setTime] = useState(100);

   useEffect(() => {
    async function fetchTimer() {
      try {
        const response = await axios.get("http://localhost:5000/QuizSetUp/getSaveTimer");
        console.log("response", response.data[0].duration);
        setTime(response.data[0].duration); // Set the timer duration
      } catch (error) {
        console.error("Error fetching timer:", error);
      }
    }
    fetchTimer();
  }, []);

  useEffect(() => {
    let timer;
    if (time > 0) {
      timer = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(timer);
      onTimerEnd(); // Call the onTimerEnd function when the timer reaches zero
    }
    return () => clearInterval(timer);
  }, [time, onTimerEnd]);


  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-2xl font-semibold">{formatTime(time)} remaining</h2>
    </div>
  );
};

export default Timerforshowquestion;
