import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function Timer() {
  const [roomKey, setRoomKey] = useState(''); // State for the room key input
  const [timeLeft, setTimeLeft] = useState(0); // Total time left in seconds
  const [isActive, setIsActive] = useState(false); // Initially set to false
  const [Timer, setTimer] = useState(null); // Initialize timer as null
  const navigate = useNavigate();

  // Fetch timer data from the API
  useEffect(() => {
    async function fetchTimer() {
      try {
        const response = await axios.get("http://localhost:5000/QuizSetUp/getSaveTimer");
        console.log("response", response.data[0]);
        setTimer(response.data[0]); // Set the first timer data
      } catch (error) {
        console.error("Error fetching timer:", error);
      }
    }

    fetchTimer();
  }, []);

  // Time calculation logic after the Timer state is set
  useEffect(() => {
    if (!Timer) return;
  
    const d = new Date();
    const currentDateTime = d.toISOString();
    const currentDate = currentDateTime.slice(0, 10);
    const targetDate = Timer.date.slice(0, 10);
  
    if (currentDate === targetDate) {
      setIsActive(true);
      
      const currentHours = d.getHours();
      const currentMinutes = d.getMinutes();
      const currentSeconds = d.getSeconds();
  
      const [targetHours, targetMinutes, targetSeconds] = Timer.time.split(':').map(Number);
  
      const hoursDiff = targetHours - currentHours;
      const minutesDiff = targetMinutes - currentMinutes;
      //const secondsDiff = targetSeconds - currentSeconds;
  
      const totalTimeLeft = (hoursDiff * 3600) + (minutesDiff * 60) ;
      setTimeLeft(totalTimeLeft);
  
      const interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 0) {
            clearInterval(interval);
           // setIsActive(false);
            return 0;
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
  
      return () => clearInterval(interval); // Cleanup on re-render or unmount
    } else {
      setIsActive(false);
    }
  }, [Timer]);
  

  const formatTime = (time) => {
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = time % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleKeySubmit = async () => {
    try {
      // Show loading or disable the button to prevent multiple submissions
      const response = await axios.post('http://localhost:5000/events/accessingquizroombykey', { key: roomKey });
      
      if (response.status === 200 && timeLeft<=0) {
        toast.success('just give me one minute')
        navigate('/showquestion', { state: { roomKey } });
      } else {
          console.log('Key not found or other error');
        toast.error('Key not found or other error')
      }
  } catch (error) {
      console.error('Error accessing quiz room:', error);
  }
  };
  

  return (
    <div className="bg-gradient-to-r from-[#2e1a47] to-[#624a82] h-screen flex items-center justify-center">
      { isActive ? (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Time Left to Quiz</h1>
          <div className="text-5xl font-mono text-gray-800 mb-6">
            {formatTime(timeLeft)}
          </div>
          <input
            type="text"
            placeholder="Enter Room Key"
            value={roomKey}
            onChange={(e) => setRoomKey(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleKeySubmit}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Enter Room
          </button>
        </div>
      ) : (
        <div>
          <h1>Too soon</h1>
        </div>
      )}
    </div>
  );
}

export default Timer;