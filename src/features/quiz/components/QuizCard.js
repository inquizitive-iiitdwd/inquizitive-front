import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updateQuizTimer } from '../../../services/quizService.js';

const QuizCard = ({ quiz, onDelete, onUpdate }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [timerDetails, setTimerDetails] = useState({
    date: quiz?.date ? new Date(quiz.date).toISOString().split('T')[0] : '',
    time: quiz?.time || '',
    duration: quiz?.duration || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTimerDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveTimer = async () => {
    const timerData = { 
      quizDate: timerDetails.date, 
      quizTime: timerDetails.time,
      quizDuration: timerDetails.duration 
    };
    try {
      await updateQuizTimer(quiz.name, timerData);
      toast.success('Timer saved!');
      onUpdate(quiz.id, timerDetails);
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save timer.');
    }
  };

  const navigateToQuizBank = () => {
    navigate('/Questiondemo', { state: { quizname: quiz.name } });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
      <h3 className="text-xl font-bold mb-4">{quiz.name}</h3>
      {isEditing ? (
        <div>
          <div className="mb-4"><label className="block text-sm mb-2">Quiz Date</label><input className="w-full px-4 py-2 bg-gray-700 rounded" type="date" name="date" value={timerDetails.date} onChange={handleInputChange} /></div>
          <div className="mb-4"><label className="block text-sm mb-2">Quiz Time</label><input className="w-full px-4 py-2 bg-gray-700 rounded" type="time" name="time" value={timerDetails.time} onChange={handleInputChange} /></div>
          <div className="mb-4"><label className="block text-sm mb-2">Duration (sec)</label><input className="w-full px-4 py-2 bg-gray-700 rounded" type="number" name="duration" value={timerDetails.duration} onChange={handleInputChange} /></div>
          <button className="w-full py-2 bg-green-600 rounded hover:bg-green-700" onClick={handleSaveTimer}>Save Timer</button>
          <button className="mt-2 w-full py-2 bg-gray-500 rounded hover:bg-gray-600" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>Date: {quiz.date ? new Date(quiz.date).toLocaleDateString() : 'Not set'}</p>
          <p>Time: {quiz.time || 'Not set'}</p>
          <p>Duration(sec): {quiz.duration || 'Not set'}</p>
          <div className="mt-4 space-y-2">
            {quiz.date && quiz.time && quiz.duration ? (
              <>
                <button className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700" onClick={navigateToQuizBank}>Go to Quiz Bank</button>
                <button className="w-full py-2 bg-yellow-600 rounded hover:bg-yellow-700" onClick={() => setIsEditing(true)}>Update Timer</button>
              </>
            ) : (
              <button className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700" onClick={() => setIsEditing(true)}>Set Timer</button>
            )}
            <button className="w-full py-2 bg-red-600 rounded hover:bg-red-700" onClick={() => onDelete(quiz.id, quiz.name)}>Delete Quiz</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCard;