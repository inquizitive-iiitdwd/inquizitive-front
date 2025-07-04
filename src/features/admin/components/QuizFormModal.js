import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

const QuizFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || "");
        setDate(
          initialData.date
            ? new Date(initialData.date).toISOString().split("T")[0]
            : ""
        );
        setTime(initialData.time || "");
        setDuration(initialData.duration || "");
      } else {
        setName("");
        setDate("");
        setTime("");
        setDuration("");
      }
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, date, time, duration });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-lg p-8 shadow-2xl border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {initialData ? `Edit: ${initialData.name}` : "Create New Quiz"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-700"
          >
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Quiz Name"
            required
            className="w-full bg-slate-700 px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            readOnly={!!initialData}
          />
          <div className="grid grid-cols-2 gap-6">
            <input
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-700 px-4 py-3 rounded-lg"
            />
            <input
              name="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-slate-700 px-4 py-3 rounded-lg"
            />
          </div>
          <input
            name="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration (in minutes)"
            className="w-full bg-slate-700 px-4 py-3 rounded-lg"
          />
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-slate-600 hover:bg-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizFormModal;
