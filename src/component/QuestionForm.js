import React, { useState, useEffect } from "react";
import { FaUpload, FaLink } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../services/api.js";

const QuestionForm = ({ quizName, roundNumber, roundConfig, onClose }) => {
  const [formData, setFormData] = useState({
    question: "",
    questionType: "single-correct", // FIX: Changed to single-correct to align with schema
    options: ["", "", "", ""], // Default 4 options
    answer: "", // For single-correct, fill-in-the-blank
    multipleAnswers: [], // FIX: For multiple-correct
    description: "",
    mediaUrl: "", // FIX: Renamed from imgSrc to mediaUrl for consistency with schema
    mediaType: "none", // FIX: Added mediaType to state
    marks: roundConfig?.marks || 1,
    negativeMarks: roundConfig?.negative_marks ? Math.abs(roundConfig.negative_marks) : 0, // FIX: Initialize as positive from config (if it was negative)
    skipMarks: roundConfig?.skip_marks ? Math.abs(roundConfig.skip_marks) : 0, // FIX: Initialize as positive from config (if it was negative)
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaSource, setMediaSource] = useState("none"); // "none", "url", "upload"
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(1);
  const [currentQuestionCount, setCurrentQuestionCount] = useState(0); // Track questions added in this round

  // Fetch next question index and initialize form based on round config
  useEffect(() => {
    const fetchNextIndex = async () => {
      try {
        const response = await api.get(`/api/creatingquiz/nextQuestionIndex?quiz_name=${quizName}&round=${roundNumber}`, { withCredentials: true });
        setIndex(response.data.nextIndex || 1);
      } catch (error) {
        console.error("Error fetching next index:", error);
        setIndex(1); // Default to 1 if fetch fails
      }
    };
    fetchNextIndex();

    // Reset form fields to reflect current round config marks
    setFormData(prev => ({
        ...prev,
        marks: roundConfig?.marks || 1,
        negativeMarks: roundConfig?.negative_marks ? Math.abs(roundConfig.negative_marks) : 0,
        skipMarks: roundConfig?.skip_marks ? Math.abs(roundConfig.skip_marks) : 0,
    }));
    // Reset current question count for the new round
    setCurrentQuestionCount(0); // Assuming form opens for each round start
  }, [quizName, roundNumber, roundConfig]); // Added roundConfig to dependency array

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...formData.options];
    newOptions[optionIndex] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  // FIX: Handle multiple answers for multiple-correct questions
  const handleMultipleAnswerChange = (optionText, isChecked) => {
    setFormData(prev => {
        const newMultipleAnswers = isChecked
            ? [...prev.multipleAnswers, optionText]
            : prev.multipleAnswers.filter(ans => ans !== optionText);
        return { ...prev, multipleAnswers: newMultipleAnswers };
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0] || null);
    setFormData(prev => ({ ...prev, mediaType: e.target.files[0]?.type.split('/')[0] || 'none' })); // FIX: Set mediaType from file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // --- Validation ---
    if (!formData.question.trim()) { // FIX: Trim to check for empty string
      toast.error("Please fill in Question Text.");
      setIsLoading(false);
      return;
    }

    if (formData.questionType === "single-correct" || formData.questionType === "multiple-correct") { // FIX: Updated question type check
      const non_empty_options = formData.options.filter(opt => opt.trim() !== ""); // FIX: Trim options
      if (non_empty_options.length < 2) { // FIX: Require at least 2 non-empty options for MCQs
        toast.error("Please provide at least two non-empty options for multiple-choice questions.");
        setIsLoading(false);
        return;
      }
    }

    let finalAnswer = formData.answer.trim(); // FIX: Trim answer
    if (formData.questionType === "multiple-correct") {
        if (formData.multipleAnswers.length === 0) {
            toast.error("Please select at least one correct answer for multiple-correct questions.");
            setIsLoading(false);
            return;
        }
        finalAnswer = formData.multipleAnswers; // Answer is an array of strings
    } else if (!finalAnswer) { // FIX: Only require answer if not multiple-correct and if it's empty
        toast.error("Please fill in the Correct Answer.");
        setIsLoading(false);
        return;
    }

    // --- Submission Data Prep ---
    const submissionData = new FormData();
    submissionData.append("quiz_name", quizName);
    submissionData.append("round_number", roundNumber);
    submissionData.append("index", index); // Current question index within the round
    submissionData.append("question", formData.question);
    submissionData.append("type", formData.questionType); // FIX: 'type' matches schema
    
    // FIX: Handle answer based on question type
    if (Array.isArray(finalAnswer)) {
        submissionData.append("answer", JSON.stringify(finalAnswer)); // Stringify array for FormData
    } else {
        submissionData.append("answer", finalAnswer);
    }
    
    submissionData.append("description", formData.description.trim()); // FIX: Trim description
    submissionData.append("marks", formData.marks);
    // FIX: Convert positive input to negative/zero for backend
    submissionData.append("negative_marks", -Math.abs(formData.negativeMarks)); 
    submissionData.append("skip_marks", -Math.abs(formData.skipMarks));

    // Filter out empty options before sending
    const validOptions = formData.options.filter(opt => opt.trim() !== "");
    validOptions.forEach((optText, i) => {
      // FIX: Assuming options schema uses text and isCorrect (for single/multiple-correct)
      // For simplicity, we are marking the selected answer(s) as isCorrect.
      // A more robust solution might involve sending correct/incorrect flags for all options.
      // For now, let's just send text and assume backend handles isCorrect based on 'answer'.
      const isCorrectOption = Array.isArray(finalAnswer) 
                                ? finalAnswer.includes(optText)
                                : optText === finalAnswer;
      submissionData.append(`options[${i}][text]`, optText);
      submissionData.append(`options[${i}][isCorrect]`, isCorrectOption);
    });

    if (mediaSource === "upload" && selectedFile) {
        submissionData.append("media_file", selectedFile); // FIX: Use a distinct field name for file upload
        submissionData.append("media_type", selectedFile.type.split("/")[0]); // FIX: Send actual media type
    } else if (mediaSource === "url" && formData.mediaUrl.trim()) { // FIX: Use mediaUrl, trim it
        submissionData.append("media_url", formData.mediaUrl.trim()); // FIX: Use distinct field name for URL
        submissionData.append("media_type", formData.mediaType); // FIX: Use mediaType from state or infer
    } else {
        submissionData.append("media_type", "none"); // FIX: Explicitly send 'none' if no media
    }

    try {
      const response = await api.post("/api/creatingquiz/addQuestion", submissionData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      if (response.status === 200) {
        toast.success("Question added successfully");
        setCurrentQuestionCount(prev => prev + 1); // Increment count for this round
        
        // Check if we've added enough questions for the current round
        if (currentQuestionCount + 1 >= roundConfig.count) { // FIX: Check next count, not current index
          toast('Round complete! Moving to next round or finishing quiz.', { icon: '👏' });
          onClose(); // This trigger tells CreateQuiz to move to next round or finish
        } else {
          // Reset form for next question in the current round
          setFormData({ 
            question: "", 
            questionType: "single-correct", 
            options: ["", "", "", ""], 
            answer: "", 
            multipleAnswers: [], // FIX: Reset multipleAnswers
            description: "", 
            mediaUrl: "", 
            mediaType: "none", // FIX: Reset media type
            marks: roundConfig?.marks || 1,
            negativeMarks: roundConfig?.negative_marks ? Math.abs(roundConfig.negative_marks) : 0,
            skipMarks: roundConfig?.skip_marks ? Math.abs(roundConfig.skip_marks) : 0,
          });
          setSelectedFile(null); // FIX: Reset selected file
          setMediaSource("none"); // FIX: Reset media source selection
          setIndex(prev => prev + 1); // Update index for next question
        }
      }
    } catch (error) {
      toast.error("Failed to add question");
      console.error("Error adding question:", error);
      // More specific error messages
      if (error.response?.data?.message) {
          toast.error(`Error: ${error.response.data.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl p-6 md:p-8 space-y-6 text-gray-800"> {/* Added text-gray-800 for default text color */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Add Question (Round {roundNumber}, Question {index} of {roundConfig?.count || 'N/A'}) {/* FIX: Show total questions */}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <fieldset className="space-y-4">
          <legend className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2 mb-4">
            Question Details
          </legend>
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700">
              Question Text
            </label>
            <textarea
              name="question"
              id="question"
              value={formData.question}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-800"
              required
            />
          </div>
          <div>
            <label htmlFor="questionType" className="block text-sm font-medium text-gray-700">
              Question Type
            </label>
            <select
              name="questionType"
              id="questionType"
              value={formData.questionType}
              onChange={(e) => {
                handleChange(e);
                // FIX: Reset options/answers when question type changes
                setFormData(prev => ({ 
                    ...prev, 
                    options: ["", "", "", ""], 
                    answer: "", 
                    multipleAnswers: [] 
                }));
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-800"
            >
              <option value="single-correct">Single Correct</option> {/* FIX: Changed to single-correct */}
              <option value="multiple-correct">Multiple Correct</option> {/* FIX: Added multiple-correct */}
              <option value="fill-in-the-blank">Fill in the Blank</option>
              {/* Add other types as needed, e.g., <option value="true-false">True/False</option> */}
            </select>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2 mb-4">
            Answer & Options
          </legend>
          {(formData.questionType === "single-correct" || formData.questionType === "multiple-correct") && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Options (at least 2 non-empty)
              </label>
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-800"
                  />
                </div>
              ))}
            </div>
          )}
          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
              Correct Answer(s)
            </label>
            {formData.questionType === "single-correct" ? (
              <select
                name="answer"
                id="answer"
                value={formData.answer}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-800"
                required // Only required for single-correct, handled by logic for multi-correct
              >
                <option value="" disabled>Select the correct option</option>
                {/* Only show non-empty options for selection */}
                {formData.options.map((opt, i) => opt.trim() && <option key={i} value={opt.trim()}>{`Option ${i + 1}: ${opt.trim()}`}</option>)}
              </select>
            ) : formData.questionType === "multiple-correct" ? ( // FIX: Multiple Correct Checkboxes
                <div className="mt-1 space-y-2">
                    {formData.options.map((opt, i) => opt.trim() && ( // Only show checkboxes for non-empty options
                        <div key={i} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`multi_option_${i}`}
                                value={opt.trim()}
                                checked={formData.multipleAnswers.includes(opt.trim())}
                                onChange={(e) => handleMultipleAnswerChange(opt.trim(), e.target.checked)}
                                className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <label htmlFor={`multi_option_${i}`} className="ml-2 text-gray-700">
                                {opt.trim()}
                            </label>
                        </div>
                    ))}
                </div>
            ) : ( // Fill in the blank
              <input
                type="text"
                name="answer"
                id="answer"
                value={formData.answer}
                onChange={handleChange}
                placeholder="Enter the exact answer"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-800"
                required
              />
            )}
          </div>
        </fieldset>
      </div>

      <fieldset className="pt-6 border-t border-gray-200">
        <legend className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2 mb-4">
          Additional Details
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Media
            </label>
            <div className="flex space-x-4">
              {["none", "url", "upload"].map((source) => (
                <button
                  type="button"
                  key={source}
                  onClick={() => {
                    setMediaSource(source);
                    // FIX: Reset media input fields when source changes
                    setFormData(prev => ({ ...prev, mediaUrl: "" }));
                    setSelectedFile(null);
                  }}
                  className={`px-3 py-2 text-sm rounded-md flex items-center gap-2 transition-all ${
                    mediaSource === source ? "bg-purple-600 text-white shadow" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {source === "none" && "None"}
                  {source === "url" && <><FaLink /> URL</>}
                  {source === "upload" && <><FaUpload /> Upload</>}
                </button>
              ))}
            </div>
            {mediaSource === "url" && (
              <input
                type="text"
                name="mediaUrl" // FIX: Renamed from imgSrc to mediaUrl
                placeholder="Enter image, audio, or video URL"
                value={formData.mediaUrl}
                onChange={handleChange}
                className="mt-2 block w-full border border-gray-300 rounded-md p-2 text-gray-800"
              />
            )}
            {mediaSource === "upload" && (
              <input
                type="file"
                name="mediaFile" // FIX: Renamed from file to mediaFile for clarity
                onChange={handleFileChange}
                accept="image/*,video/*,audio/*"
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            )}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea // FIX: Changed to textarea for more space
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="3" // FIX: Added rows for textarea
              placeholder="Explain why the answer is correct (optional)"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-800"
            />
          </div>
          <div>
            <label htmlFor="marks" className="block text-sm font-medium text-gray-700">
              Marks (Per Question)
            </label>
            <input
              type="number"
              name="marks"
              id="marks"
              value={formData.marks}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-800"
              min="0"
              required // Marks should always be provided
            />
          </div>
          <div>
            <label htmlFor="negativeMarks" className="block text-sm font-medium text-gray-700">
              Negative Marks (Enter as positive, e.g., 1 for -1 mark)
            </label>
            <input
              type="number"
              name="negativeMarks"
              id="negativeMarks"
              value={formData.negativeMarks}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-800"
              min="0" // FIX: Ensure positive input on frontend
              required // Marks should always be provided
            />
          </div>
          <div>
            <label htmlFor="skipMarks" className="block text-sm font-medium text-gray-700">
              Skip Marks (Enter as positive, e.g., 0.5 for -0.5 mark)
            </label>
            <input
              type="number"
              name="skipMarks"
              id="skipMarks"
              value={formData.skipMarks}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-800"
              min="0" // FIX: Ensure positive input on frontend
              required // Marks should always be provided
            />
          </div>
        </div>
      </fieldset>

      <div className="flex justify-end pt-4 gap-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-400 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? "Submitting..." : `Add Question ${index} / ${roundConfig?.count || 'N/A'}`} {/* FIX: Show current/total */}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;