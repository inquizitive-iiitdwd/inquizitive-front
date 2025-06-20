// src/component/AdminAdminDashboard
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { getQuizzes, createQuiz, deleteQuiz, addMember } from '../services/quizService.js';
import QuizCard from '../features/quiz/components/QuizCard.js'; // Assuming you created this component

// A generic card for other AdminDashboard actions
const SectionCard = ({ title, children }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    {children}
  </div>
);

// Form for creating a quiz
const CreateQuizForm = ({ onQuizCreated }) => {
  const [quizName, setQuizName] = useState('');

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!quizName.trim()) {
      toast.error('Quiz name cannot be empty.');
      return;
    }
    try {
      await createQuiz(quizName);
      toast.success(`Quiz "${quizName}" created successfully!`);
      onQuizCreated({ name: quizName, date: '', time: '', duration: '' }); // Optimistic update
      setQuizName('');
    } catch (error) {
      toast.error('Error creating quiz.');
      console.error(error);
    }
  };

  return (
    <SectionCard title="Create Quiz">
      <form onSubmit={handleCreateQuiz}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="QuizName">Quiz Name</label>
          <input
            id="QuizName"
            className="w-full px-4 py-2 bg-gray-700 rounded"
            type="text"
            placeholder="Enter Quiz name"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full py-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors">
          Create Quiz
        </button>
      </form>
    </SectionCard>
  );
};

// Main AdminDashboard Component
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuizzes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getQuizzes();
      // Assuming the backend returns an array of quizzes, each with a unique ID like _id
      setQuizzes(response.data);
    } catch (error) {
      toast.error('Failed to fetch quizzes.');
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);
  
  const handleQuizCreated = (newQuiz) => {
    // To see the new quiz immediately, we can refetch or just add it to the state
    fetchQuizzes(); 
  };

  const handleDeleteQuiz = async (quizId, quizName) => {
    if (window.confirm(`Are you sure you want to delete the quiz: "${quizName}"?`)) {
      try {
        await deleteQuiz(quizName); // Your API expects the name
        setQuizzes(prevQuizzes => prevQuizzes.filter(q => q._id !== quizId));
        toast.success('Quiz deleted successfully.');
      } catch (error) {
        toast.error('Error deleting quiz.');
        console.error(error);
      }
    }
  };
  
  const handleUpdateQuiz = (quizId, updatedTimerDetails) => {
    setQuizzes(prevQuizzes =>
      prevQuizzes.map(q =>
        q._id === quizId ? { ...q, ...updatedTimerDetails } : q
      )
    );
  };

  return (
    <div className="bg-gradient-to-r from-[#2e1a47] to-[#624a82] min-h-screen text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Admin AdminDashboard</h1>

        {isLoading ? (
          <p className="text-center">Loading Quizzes...</p>
        ) : (
          quizzes.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Created Quizzes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {quizzes.map(quiz => (
                  <QuizCard
                    key={quiz._id || quiz.name} // Prefer a unique ID from the database
                    quiz={quiz}
                    onDelete={handleDeleteQuiz}
                    onUpdate={handleUpdateQuiz}
                  />
                ))}
              </div>
            </div>
          )
        )}
        
        <h2 className="text-2xl font-bold mb-4 mt-8">Admin Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CreateQuizForm onQuizCreated={handleQuizCreated} />

          <SectionCard title="Buzzer Room">
            <p>Manage buzzer room settings and participants.</p>
            <button className="mt-4 w-full py-2 bg-green-600 rounded hover:bg-green-700" onClick={() => navigate('/adminebuzzer')}>
              Enter Buzzer Room
            </button>
          </SectionCard>
          
           {/* You can create components for these as well, like AddMemberForm, BlockUserForm etc. */}
          <SectionCard title="Add Member">
            <p>Add new members to the team page.</p>
             {/* <AddMemberForm /> */}
          </SectionCard>

          <SectionCard title="Block User">
            <p>Block users from accessing the platform.</p>
            {/* <BlockUserForm /> */}
          </SectionCard>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default AdminDashboard;