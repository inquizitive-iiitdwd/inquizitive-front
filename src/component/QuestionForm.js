import React, { useState, useEffect } from "react";
import { FaUpload, FaLink } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../services/api.js";

const QuestionForm = ({ quizName, roundNumber, roundConfig, onClose }) => {
  const [formData, setFormData] = useState({
    question: "",
    questionType: "single-correct",
    options: ["", "", "", ""],
    answer: "",
    multipleAnswers: [],
    description: "",
    mediaUrl: "",
    mediaType: "none",
    marks: roundConfig?.marks || 1,
    negativeMarks: roundConfig?.negative_marks
      ? Math.abs(roundConfig.negative_marks)
      : 0,
    skipMarks: roundConfig?.skip_marks ? Math.abs(roundConfig.skip_marks) : 0,
  });
  console.log(quizName);
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaSource, setMediaSource] = useState("none");
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(1);
  const [currentQuestionCount, setCurrentQuestionCount] = useState(0);

  useEffect(() => {
    const fetchNextIndex = async () => {
      try {
        const response = await api.get(
          `/api/creatingquiz/nextQuestionIndex?quiz_name=${quizName}&round=${roundNumber}`,
          { withCredentials: true }
        );
        setIndex(response.data.nextIndex || 1);
      } catch (error) {
        console.error("Error fetching next index:", error);
        setIndex(1);
      }
    };
    fetchNextIndex();
    setFormData((prev) => ({
      ...prev,
      marks: roundConfig?.marks || 1,
      negativeMarks: roundConfig?.negative_marks
        ? Math.abs(roundConfig.negative_marks)
        : 0,
      skipMarks: roundConfig?.skip_marks ? Math.abs(roundConfig.skip_marks) : 0,
    }));
    setCurrentQuestionCount(0);
  }, [quizName, roundNumber, roundConfig]);

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
    setFormData((prev) => {
      const newMultipleAnswers = isChecked
        ? [...prev.multipleAnswers, optionText]
        : prev.multipleAnswers.filter((ans) => ans !== optionText);
      return { ...prev, multipleAnswers: newMultipleAnswers };
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Submitting with quiz_name:", quizName);

    // --- Validation ---
    if (!formData.question.trim()) {
      toast.error("Please fill in the Question Text.");
      setIsLoading(false);
      return;
    }
    const non_empty_options = formData.options.filter(
      (opt) => opt.trim() !== ""
    );
    if (
      (formData.questionType === "single-correct" ||
        formData.questionType === "multiple-correct") &&
      non_empty_options.length < 2
    ) {
      toast.error(
        "Please provide at least two non-empty options for multiple-choice questions."
      );
      setIsLoading(false);
      return;
    }
    let finalAnswer = formData.answer.trim();
    if (formData.questionType === "multiple-correct") {
      if (formData.multipleAnswers.length === 0) {
        toast.error(
          "Please select at least one correct answer for multiple-correct questions."
        );
        setIsLoading(false);
        return;
      }
      // NOTE: Your backend only supports a single text answer. We will join multiple answers with a comma.
      // You may need to update your backend logic to handle this if you need true multiple-answer support.
      finalAnswer = formData.multipleAnswers.join(", ");
    } else if (!finalAnswer) {
      toast.error("Please provide the Correct Answer.");
      setIsLoading(false);
      return;
    }

    // --- START OF FIX: Data Preparation ---
    // Your backend expects a simple FormData structure, not a complex JSON object.
    const submissionData = new FormData();

    // Standard fields that match the backend's `req.body` expectations
    submissionData.append("quiz_name", quizName);
    submissionData.append("round_number", roundNumber);
    submissionData.append("index", index);
    submissionData.append("question", formData.question.trim());
    submissionData.append("questionType", formData.questionType);
    submissionData.append("answer", finalAnswer);
    submissionData.append("description", formData.description.trim());
    submissionData.append("marks", formData.marks);
    submissionData.append("negative_marks", -Math.abs(formData.negativeMarks));
    submissionData.append("skip_marks", -Math.abs(formData.skipMarks));

    // FIX #1: Append options as `options1`, `options2`, etc. to match the backend `for` loop
    formData.options.forEach((opt, i) => {
      if (opt.trim() !== "") {
        submissionData.append(`options${i + 1}`, opt.trim());
      }
    });

    // FIX #2: Append media URL in the fields the backend expects: `file_type` and `image`
    // Your backend code does not support direct file uploads, only URLs.
    if (mediaSource === "url" && formData.mediaUrl.trim()) {
      submissionData.append("file_type", formData.mediaType); // e.g., 'image', 'video'
      submissionData.append("image", formData.mediaUrl.trim()); // The URL
    } else if (mediaSource === "upload" && selectedFile) {
      toast.error(
        "Direct file upload is not supported. Please use a URL instead."
      );
      setIsLoading(false);
      return;
    }
    // --- END OF FIX ---

    try {
      const response = await api.post(
        "/api/creatingquiz/addQuestion",
        submissionData,
        {
          withCredentials: true,
          // When using FormData, the browser automatically sets 'Content-Type': 'multipart/form-data'
        }
      );
      if (response.status === 200) {
        toast.success("Question added successfully");
        setCurrentQuestionCount((prev) => prev + 1);

        if (currentQuestionCount + 1 >= (roundConfig.count || 0)) {
          toast("Round complete!", { icon: "👏" });
          onClose();
        } else {
          // Reset form for next question
          setFormData({
            question: "",
            questionType: "single-correct",
            options: ["", "", "", ""],
            answer: "",
            multipleAnswers: [],
            description: "",
            mediaUrl: "",
            mediaType: "none",
            marks: roundConfig?.marks || 1,
            negativeMarks: roundConfig?.negative_marks
              ? Math.abs(roundConfig.negative_marks)
              : 0,
            skipMarks: roundConfig?.skip_marks
              ? Math.abs(roundConfig.skip_marks)
              : 0,
          });
          setSelectedFile(null);
          setMediaSource("none");
          setIndex((prev) => prev + 1);
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.details ||
        error.response?.data?.error ||
        "Failed to add question";
      toast.error(errorMessage);
      console.error("Error adding question:", error.response || error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-2xl p-6 md:p-8 space-y-6 text-gray-800"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Add Question (Round {roundNumber}, Question {index} of{" "}
        {roundConfig?.count || "N/A"})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <fieldset className="space-y-4">
          <legend className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2 mb-4">
            Question Details
          </legend>
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-800"
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
              onChange={(e) => {
                handleChange(e);
                setFormData((prev) => ({
                  ...prev,
                  options: ["", "", "", ""],
                  answer: "",
                  multipleAnswers: [],
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
          {(formData.questionType === "single-correct" ||
            formData.questionType === "multiple-correct") && (
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
            <label
              htmlFor="answer"
              className="block text-sm font-medium text-gray-700"
            >
              Correct Answer(s)
            </label>
            {formData.questionType === "single-correct" ? (
              <select
                name="answer"
                id="answer"
                value={formData.answer}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-800"
                required
              >
                <option value="" disabled>
                  Select the correct option
                </option>
                {formData.options.map(
                  (opt, i) =>
                    opt.trim() && (
                      <option key={i} value={opt.trim()}>{`Option ${
                        i + 1
                      }: ${opt.trim()}`}</option>
                    )
                )}
              </select>
            ) : formData.questionType === "multiple-correct" ? (
              <div className="mt-1 space-y-2">
                {formData.options.map(
                  (opt, i) =>
                    opt.trim() && (
                      <div key={i} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`multi_option_${i}`}
                          value={opt.trim()}
                          checked={formData.multipleAnswers.includes(
                            opt.trim()
                          )}
                          onChange={(e) =>
                            handleMultipleAnswerChange(
                              opt.trim(),
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`multi_option_${i}`}
                          className="ml-2 text-gray-700"
                        >
                          {opt.trim()}
                        </label>
                      </div>
                    )
                )}
              </div>
            ) : (
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
                    setFormData((prev) => ({ ...prev, mediaUrl: "" }));
                    setSelectedFile(null);
                  }}
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
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="marks"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="negativeMarks"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="skipMarks"
              className="block text-sm font-medium text-gray-700"
            >
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
          {isLoading
            ? "Submitting..."
            : `Add Question ${index} / ${roundConfig?.count || "N/A"}`}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;
