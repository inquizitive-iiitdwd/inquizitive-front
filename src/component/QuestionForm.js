// QuestionForm.js
import React, { useState, useEffect } from "react";
import { FaUpload, FaLink, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../services/api.js";

// Accept quizId as a prop
const QuestionForm = ({ quizName, quizId, roundNumber, roundConfig, onClose, onQuestionAddedOrUpdated }) => {
  const [formData, setFormData] = useState({
    question: "",
    questionType: "single-correct",
    options: ["", "", "", ""],
    answer: "", // For single-correct, fill-in-the-blank
    multipleAnswers: [], // For multiple-correct
    description: "",
    mediaUrl: "", // For media URL
    mediaType: "none", // Type of media (image, audio, video) if using URL
    marks: roundConfig?.marks ?? 1, // Use nullish coalescing
    negativeMarks: roundConfig?.negative_marks ? Math.abs(roundConfig.negative_marks) : 0,
    skipMarks: roundConfig?.skip_marks ? Math.abs(roundConfig.skip_marks) : 0,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaSource, setMediaSource] = useState("none"); // "none", "url", "upload"
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(1);
  
  // Fetch next question index and initialize form based on round config
  useEffect(() => {
    const fetchNextIndex = async () => {
      // Use quizId for fetching next index, as it's more robust
      if (!quizId) {
        console.warn("Quiz ID not available for fetching next question index.");
        toast.error("Error: Quiz ID not available for this round. Please ensure quiz is fully saved.");
        return;
      }
      try {
        const response = await api.get(`/api/creatingquiz/nextQuestionIndex?quiz_id=${quizId}&round=${roundNumber}`, { withCredentials: true });
        setIndex(response.data.nextIndex || 1);
      } catch (error) {
        console.error("Error fetching next index:", error);
        toast.error("Failed to get next question index.");
        setIndex(1); // Default to 1 if fetch fails
      }
    };
    fetchNextIndex();

    // Reset form fields to reflect current round config marks and clear previous question data
    setFormData(prev => ({
        ...prev,
        question: "", // Clear question text
        questionType: "single-correct", // Reset type
        options: ["", "", "", ""], // Reset options
        answer: "", // Reset answer
        multipleAnswers: [], // Reset multiple answers
        description: "", // Clear description
        mediaUrl: "", // Clear media URL
        mediaType: "none", // Reset media type
        marks: roundConfig?.marks ?? 1,
        negativeMarks: roundConfig?.negative_marks ? Math.abs(roundConfig.negative_marks) : 0,
        skipMarks: roundConfig?.skip_marks ? Math.abs(roundConfig.skip_marks) : 0,
    }));
    setSelectedFile(null); // Clear selected file
    setMediaSource("none"); // Reset media source selection
  }, [quizId, roundNumber, roundConfig]); // Added quizId to dependencies, roundConfig

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...formData.options];
    newOptions[optionIndex] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleMultipleAnswerChange = (optionText, isChecked) => {
    setFormData(prev => {
        const newMultipleAnswers = isChecked
            ? [...prev.multipleAnswers, optionText]
            : prev.multipleAnswers.filter(ans => ans !== optionText);
        return { ...prev, multipleAnswers: newMultipleAnswers };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
    if (file) {
      setFormData(prev => ({ ...prev, mediaType: file.type.split('/')[0] }));
    } else {
      setFormData(prev => ({ ...prev, mediaType: 'none' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Submitting question. Current quizId:", quizId);

    // --- Validation ---
    if (!quizId) {
      toast.error("Quiz ID is missing. Cannot add question.");
      setIsLoading(false);
      return;
    }
    if (!formData.question.trim()) {
      toast.error("Please fill in Question Text.");
      setIsLoading(false);
      return;
    }

    const non_empty_options = formData.options.filter(opt => opt.trim() !== "");

    if (formData.questionType === "single-correct" || formData.questionType === "multiple-correct") {
      if (non_empty_options.length < 2) {
        toast.error("Please provide at least two non-empty options for multiple-choice questions.");
        setIsLoading(false);
        return;
      }
    }

    let finalAnswer;
    let optionsForBackend = []; // To store options with isCorrect flag

    if (formData.questionType === "multiple-correct") {
        if (formData.multipleAnswers.length === 0) {
            toast.error("Please select at least one correct answer for multiple-correct questions.");
            setIsLoading(false);
            return;
        }
        finalAnswer = formData.multipleAnswers;
        // Construct options array for backend
        optionsForBackend = non_empty_options.map(optText => ({
            text: optText,
            isCorrect: formData.multipleAnswers.includes(optText)
        }));
    } else { // single-correct or fill-in-the-blank
        if (!formData.answer.trim()) {
            toast.error("Please fill in the Correct Answer.");
            setIsLoading(false);
            return;
        }
        finalAnswer = formData.answer.trim();
        // For single-correct, mark the selected answer as correct
        optionsForBackend = non_empty_options.map(optText => ({
            text: optText,
            isCorrect: optText === finalAnswer
        }));
    }
    
    // --- Submission Data Prep ---
    const submissionData = new FormData();
    submissionData.append("quiz_id", quizId); // NEW: Send quiz_id instead of quiz_name
    submissionData.append("quiz_name", quizName); // Keep quiz_name for backend debugging/display in question document
    submissionData.append("round_number", roundNumber);
    submissionData.append("index", index);
    submissionData.append("question", formData.question.trim());
    submissionData.append("questionType", formData.questionType); // Match backend `questionType`

    // IMPORTANT: Stringify arrays/objects for FormData
    submissionData.append("answer", JSON.stringify(finalAnswer));
    submissionData.append("options", JSON.stringify(optionsForBackend)); // Send structured options

    submissionData.append("description", formData.description.trim());
    submissionData.append("marks", formData.marks);
    // Convert positive input to negative/zero for backend
    submissionData.append("negative_marks", -Math.abs(formData.negativeMarks));
    submissionData.append("skip_marks", -Math.abs(formData.skipMarks));
    // Pass is_buzzer_round status from roundConfig
    submissionData.append("is_buzzer_round", roundConfig?.is_buzzer_round ? 'true' : 'false'); // Send as string 'true'/'false'


    // Media Handling: only send URL directly with addQuestion for now
    if (mediaSource === "url" && formData.mediaUrl.trim()) {
      const mediaUrl = formData.mediaUrl.trim();
      const mediaType = formData.mediaType === 'none' ? 'image' : formData.mediaType; // Default to image if generic URL
      submissionData.append("file_type", mediaType); // Backend expects file_type
      submissionData.append("image", mediaUrl); // Backend expects image for URL
    } else if (mediaSource === "upload" && selectedFile) {
        toast.error("File upload for media is a separate step not integrated into this form submission. Please use URL or upload after question creation.");
        setIsLoading(false);
        return;
    }


    try {
      const response = await api.post("/api/creatingquiz/addQuestion", submissionData, {
        withCredentials: true,
        headers: {
            // Let Axios/browser handle Content-Type: 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        toast.success("Question added successfully");
        // Capture the newly created question _id from backend response if possible
        // Assuming backend sends { message, question_id }
        const newQuestionWithId = {
            _id: response.data.question_id, // Get _id from backend
            quiz_id: quizId,
            quizname: quizName,
            round_number: roundNumber,
            index: index,
            question: formData.question.trim(),
            type: formData.questionType,
            options: optionsForBackend,
            answer: finalAnswer,
            description: formData.description.trim(),
            marks: formData.marks,
            negative_marks: -Math.abs(formData.negativeMarks),
            skip_marks: -Math.abs(formData.skipMarks),
            is_buzzer_round: roundConfig?.is_buzzer_round ? true : false,
            // Add media details if applicable
            media: (mediaSource === "url" && formData.mediaUrl.trim()) ? { type: formData.mediaType, url: formData.mediaUrl.trim() } : null,
            created_at: new Date().toISOString() // Or get from backend
        };
        onQuestionAddedOrUpdated(newQuestionWithId); // Pass the full new question object to parent

        // Check if we've added enough questions for the current round
        const expectedTotalQuestionsInRound = roundConfig.count === '' ? 0 : parseInt(roundConfig.count) || 0;

        if (index >= expectedTotalQuestionsInRound) {
          toast('Round complete! Moving to next round or finishing quiz.', { icon: '👏' });
          onClose(); // This trigger tells CreateQuiz to move to next round or finish
        } else {
          // Reset form for next question in the current round
          setFormData({
            question: "",
            questionType: "single-correct",
            options: ["", "", "", ""],
            answer: "",
            multipleAnswers: [],
            description: "",
            mediaUrl: "",
            mediaType: "none",
            marks: roundConfig?.marks ?? 1,
            negativeMarks: roundConfig?.negative_marks ? Math.abs(roundConfig.negativeMarks) : 0,
            skipMarks: roundConfig?.skip_marks ? Math.abs(roundConfig.skipMarks) : 0,
          });
          setSelectedFile(null);
          setMediaSource("none");
          setIndex(prev => prev + 1); // Update index for next question
        }
      }
    } catch (error) {
      toast.error("Failed to add question");
      console.error("Error adding question:", error);
      if (error.response?.data?.error) {
          toast.error(`Backend Error: ${error.response.data.error}`);
      } else if (error.response?.data?.details) {
          toast.error(`Details: ${error.response.data.details}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl p-6 md:p-8 space-y-6 text-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Add Question (Round {roundNumber}, Question {index} of {roundConfig?.count ?? 'N/A'})
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FaTimes size={24} />
        </button>
      </div>

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
                setFormData(prev => ({
                    ...prev,
                    options: ["", "", "", ""],
                    answer: "",
                    multipleAnswers: []
                }));
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-800"
            >
              <option value="single-correct">Single Correct</option>
              <option value="multiple-correct">Multiple Correct</option>
              <option value="fill-in-the-blank">Fill in the Blank</option>
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
                required={formData.questionType === "single-correct"}
              >
                <option value="" disabled>Select the correct option</option>
                {formData.options.map((opt, i) => opt.trim() && <option key={i} value={opt.trim()}>{`Option ${i + 1}: ${opt.trim()}`}</option>)}
              </select>
            ) : formData.questionType === "multiple-correct" ? (
                <div className="mt-1 space-y-2">
                    {formData.options.map((opt, i) => opt.trim() && (
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
                required={formData.questionType === "fill-in-the-blank"}
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
                name="mediaUrl"
                placeholder="Enter image, audio, or video URL"
                value={formData.mediaUrl}
                onChange={handleChange}
                className="mt-2 block w-full border border-gray-300 rounded-md p-2 text-gray-800"
              />
            )}
            {mediaSource === "upload" && (
              <input
                type="file"
                name="mediaFile"
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
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
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
              required
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
              min="0"
              required
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
              min="0"
              required
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
          {isLoading ? "Submitting..." : `Add Question ${index} / ${roundConfig?.count ?? 'N/A'}`}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;