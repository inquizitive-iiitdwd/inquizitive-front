import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiDatabase, FiPlayCircle } from 'react-icons/fi';
import { getQuizzes, createQuiz, deleteQuiz, updateQuizTimer } from '../../../services/quizService.js';
import QuizModal from '../components/QuizFormModal.js';

const QuizManager = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  const fetchQuizzes = useCallback(async () => {
    try {
      const response = await getQuizzes();
      setQuizzes(response);
    } catch (error) {
      toast.error('Failed to fetch quizzes.');
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleOpenCreateModal = () => {
    setEditingQuiz(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (quiz) => {
    setEditingQuiz(quiz);
    setIsModalOpen(true);
  };

  const handleDelete = async (quizName) => {
    if (!window.confirm(`Are you sure you want to delete "${quizName}"?`)) return;
    try {
      await deleteQuiz(quizName);
      toast.success(`Quiz "${quizName}" deleted successfully.`);
      fetchQuizzes();
    } catch (error) {
      toast.error('Failed to delete quiz.');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingQuiz) {
        await updateQuizTimer(editingQuiz.name, { duration: formData.duration });
        toast.success(`Timer for "${editingQuiz.name}" updated.`);
      } else {
        await createQuiz(formData.name);
        toast.success(`Quiz "${formData.name}" created successfully.`);
      }
      fetchQuizzes();
    } catch (error) {
      toast.error('An error occurred while saving.');
    }
  };

  return (
    <>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Quiz Management</h1>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-yellow-400 text-black font-bold px-5 py-3 rounded-lg hover:bg-yellow-300"
          >
            <FiPlus />
            Create Quiz
          </button>
        </div>
        <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-slate-900/70 text-sm uppercase">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Duration</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz._id} className="border-t border-slate-700">
                  <td className="p-4 font-semibold text-white">{quiz.name}</td>
                  <td className="p-4">
                    {quiz.date
                      ? `${new Date(quiz.date).toLocaleDateString()} at ${quiz.time || 'N/A'}`
                      : 'Not Set'}
                  </td>
                  <td className="p-4">
                    {quiz.duration ? `${quiz.duration} mins` : 'Not Set'}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => navigate('/adminebuzzer')}
                        title="Admin Buzzer"
                      >
                        <FiPlayCircle className="text-green-400" size={20} />
                      </button>
                      <button
                        onClick={() =>
                          navigate('/question-form', { state: { quizname: quiz.name } })
                        }
                        title="Edit Questions"
                      >
                        <FiDatabase className="text-blue-400" size={20} />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(quiz)}
                        title="Set/Edit Timer"
                      >
                        <FiEdit className="text-yellow-400" size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(quiz.name)}
                        title="Delete Quiz"
                      >
                        <FiTrash2 className="text-red-400" size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <QuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingQuiz ? { name: editingQuiz.name, duration: editingQuiz.duration } : null}
      />
    </>
  );
};

export default QuizManager;