// src/features/admin/components/QuizModal.js
import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const QuizModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || { name: '', duration: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Edit Quiz Timer' : 'Create New Quiz'}
          </h2>
          <button onClick={onClose} className="text-white"><FiX size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          {!initialData && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Quiz Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-800 text-white"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-300">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-800 text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            {initialData ? 'Update Timer' : 'Create Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizModal;