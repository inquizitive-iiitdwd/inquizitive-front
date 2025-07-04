// src/components/QuestionForm.js

import React, { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { FaTrashAlt, FaImage, FaUpload, FaLink } from "react-icons/fa";

const initialFormState = {
  questionId: "",
  question: "",
  questionType: "multiple-choice",
  options: ["", "", "", ""],
  answer: "",
  description: "",
  imgSrc: "",
  marks: 1,
  negativeMarks: 0,
};

const QuestionForm = ({ onQuestionSubmit, quizname }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaSource, setMediaSource] = useState("none"); // 'none', 'url', 'upload'
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0] || null);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedFile(null);
    setMediaSource("none");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // --- Validation ---
    if (!formData.questionId || !formData.question || !formData.answer) {
      alert("Please fill in Question ID, Question, and Answer.");
      setIsLoading(false);
      return;
    }
    if (
      formData.questionType === "multiple-choice" &&
      formData.options.every((opt) => opt === "")
    ) {
      alert(
        "Please provide at least one option for a multiple-choice question."
      );
      setIsLoading(false);
      return;
    }

    // --- Prepare Data for Submission ---
    const submissionData = new FormData();

    // Append all form text data
    submissionData.append("questionId", formData.questionId);
    submissionData.append("question", formData.question);
    submissionData.append("questionType", formData.questionType);
    submissionData.append("answer", formData.answer);
    submissionData.append("description", formData.description);
    submissionData.append("quizname", quizname);
    submissionData.append("marks", formData.marks);
    submissionData.append("negativeMarks", formData.negativeMarks);

    // Append options based on schema (options1, options2, etc.)
    formData.options.forEach((opt, i) => {
      submissionData.append(`options${i + 1}`, opt);
    });

    // Append media file or URL based on user choice
    if (mediaSource === "upload" && selectedFile) {
      submissionData.append("file", selectedFile);
      submissionData.append("file_type", selectedFile.type.split("/")[0]); // 'image', 'video', etc.
    } else if (mediaSource === "url" && formData.imgSrc) {
      submissionData.append("image", formData.imgSrc); // Corresponds to `image` column for URLs
    }

    const success = await onQuestionSubmit(submissionData);

    if (success) {
      resetForm();
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-2xl p-6 md:p-8 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* ----- LEFT COLUMN ----- */}
        <fieldset className="space-y-4">
          <legend className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2 mb-4">
            Question Details
          </legend>

          <div>
            <label
              htmlFor="questionId"
              className="block text-sm font-medium text-gray-700"
            >
              Question ID (Unique Integer)
            </label>
            <input
              type="number"
              name="questionId"
              id="questionId"
              value={formData.questionId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium text-gray-700"
            >
              Question Text
            </label>
            <textarea
              name="question"
              id="question"
              value={formData.question}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="questionType"
              className="block text-sm font-medium text-gray-700"
            >
              Question Type
            </label>
            <select
              name="questionType"
              id="questionType"
              value={formData.questionType}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="fill-in-the-blank">Fill in the Blank</option>
            </select>
          </div>
        </fieldset>

        {/* ----- RIGHT COLUMN ----- */}
        <fieldset className="space-y-4">
          <legend className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2 mb-4">
            Answer & Options
          </legend>

          {/* Conditional Options for Multiple Choice */}
          {formData.questionType === "multiple-choice" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Options
              </label>
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              ))}
            </div>
          )}

          <div>
            <label
              htmlFor="answer"
              className="block text-sm font-medium text-gray-700"
            >
              Correct Answer
            </label>
            {formData.questionType === "multiple-choice" ? (
              <select
                name="answer"
                id="answer"
                value={formData.answer}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
                required
              >
                <option value="" disabled>
                  Select the correct option
                </option>
                {formData.options.map(
                  (opt, i) =>
                    opt && (
                      <option key={i} value={opt}>{`Option ${
                        i + 1
                      }: ${opt}`}</option>
                    )
                )}
              </select>
            ) : (
              <input
                type="text"
                name="answer"
                id="answer"
                value={formData.answer}
                onChange={handleChange}
                placeholder="Enter the exact answer"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            )}
          </div>
        </fieldset>
      </div>

      {/* ----- FULL-WIDTH ADDITIONAL DETAILS SECTION ----- */}
      <fieldset className="pt-6 border-t border-gray-200">
        <legend className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2 mb-4">
          Additional Details (Optional)
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Media Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Media
            </label>
            <div className="flex space-x-4">
              {["none", "url", "upload"].map((source) => (
                <button
                  type="button"
                  key={source}
                  onClick={() => setMediaSource(source)}
                  className={`px-3 py-2 text-sm rounded-md flex items-center gap-2 transition-all ${
                    mediaSource === source
                      ? "bg-purple-600 text-white shadow"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {source === "none" && "None"}
                  {source === "url" && (
                    <>
                      <FaLink /> URL
                    </>
                  )}
                  {source === "upload" && (
                    <>
                      <FaUpload /> Upload
                    </>
                  )}
                </button>
              ))}
            </div>
            {mediaSource === "url" && (
              <input
                type="text"
                name="imgSrc"
                placeholder="Enter image or video URL"
                value={formData.imgSrc}
                onChange={handleChange}
                className="mt-2 block w-full border border-gray-300 rounded-md p-2"
              />
            )}
            {mediaSource === "upload" && (
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                accept="image/*,video/*,audio/*"
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            )}
          </div>

          {/* Description Section */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Answer Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain why the answer is correct"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Marks Section */}
          <div>
            <label
              htmlFor="marks"
              className="block text-sm font-medium text-gray-700"
            >
              Marks
            </label>
            <select
              name="marks"
              id="marks"
              value={formData.marks}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="5">5</option>
            </select>
          </div>

          {/* Negative Marks Section */}
          <div>
            <label
              htmlFor="negativeMarks"
              className="block text-sm font-medium text-gray-700"
            >
              Negative Marks
            </label>
            <select
              name="negativeMarks"
              id="negativeMarks"
              value={formData.negativeMarks}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
            >
              <option value="0">0</option>
              <option value="-1">-1</option>
              <option value="-2">-2</option>
            </select>
          </div>
        </div>
      </fieldset>

      {/* ----- SUBMIT BUTTON ----- */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? "Submitting..." : "Submit Question"}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;
