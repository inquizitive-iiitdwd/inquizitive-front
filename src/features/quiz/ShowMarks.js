import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../services/api.js';
import { useLocation } from 'react-router-dom';

const ShowMarks = () => {
  const location = useLocation();
  const { quizName } = location.state || {}; // Get quizName, default to undefined if not present
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!quizName) {
        toast.error("Quiz name is required to fetch marks");
        return;
      }
      try {
        const response = await api.get(`/api/creatingquiz/getMarks?name=${quizName}`);
        console.log(response.data);
        if (response.data.ok === false) {
          toast.error("Failed to get marks");
          return;
        }
        setMarks(response.data.marks);
      } catch (err) {
        console.log(err);
        toast.error("Error fetching marks");
      }
    };

    fetchData();
  }, [quizName]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Marks for {quizName || 'Unknown Quiz'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marks.map((mark, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4">
            <p className="font-semibold">Team Name: <span className="font-normal">{mark.teamname || 'N/A'}</span></p>
            <p className="font-semibold">Timestamp: <span className="font-normal">{new Date(mark.timestamp).toLocaleString()}</span></p>
            <p className="font-semibold">Lead Mail ID: <span className="font-normal">{mark.leadmailid}</span></p>
            <p className="font-semibold">Marks: <span className="font-normal">{mark.marks}</span></p>
          </div>
        ))}
      </div>
      <Toaster />
    </div>
  );
};

export default ShowMarks;