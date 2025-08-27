import React, { useState } from "react";
import toast from "react-hot-toast";

const EditQuizModal = ({ quiz, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: quiz.date ? new Date(quiz.date).toISOString().split("T")[0] : "",
    time: quiz.time || "",
    duration: quiz.duration || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.date || !formData.time || !formData.duration) {
      toast.error("Please fill in all fields: date, time, and duration.");
      return;
    }
    onSave(quiz.name, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">
          Edit Timer for: {quiz.name}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Quiz Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Quiz Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Duration (in minutes)
            </label>
            <input
              type="number"
              name="duration"
              placeholder="e.g., 30"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuizModal;
