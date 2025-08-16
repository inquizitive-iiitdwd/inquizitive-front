import React, { useState, useEffect } from "react";
import { useGlobalcontext } from "../../context/QuizContext.js";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaEye,
  FaImage,
  FaPlay,
  FaVolumeUp,
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../services/api.js";
import { useNavigate } from "react-router-dom";
import NavBar from "../../component/NavBar.js";
import QuestionForm from "../../component/QuestionForm.js"; // Ensure this path is correct

const CreateQuiz = ({ onQuestionsChange }) => {
  const { questions } = useGlobalcontext();
  const [questionList, setQuestionList] = useState(questions);
  const [quizName, setQuizName] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [setupStep, setSetupStep] = useState(0);
  const [totalRounds, setTotalRounds] = useState(1);
  const [hasBuzzerRound, setHasBuzzerRound] = useState(false);
  const [roundQuestions, setRoundQuestions] = useState({});
  const [currentRound, setCurrentRound] = useState(1);
  const [createdQuiz, setCreatedQuiz] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `/api/creatingquiz/questionsForQuiz?name=${quizName}`,
          { withCredentials: true }
        );
        setQuestionList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // This is the block that was causing the logout
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error("Unauthorized access. Please log in as an admin.");
          navigate("/admin-login"); // Corrected to admin login path
        }
      }
    };

    if (quizName && setupStep !== 0) {
      // This condition is the source of the bug, but the fix below prevents it from being evaluated at the wrong time.
      fetchData();
    } else if (questions && questions.length > 0 && questions[0].quizname) {
      setQuizName(questions[0].quizname);
      setQuestionList(questions);
    }
    // FIX: Removed `setupStep` from the dependency array to prevent re-running this effect
    // during the quiz creation steps, which stops the premature API call.
  }, [questions, quizName, navigate]);

  const handleViewMarks = () => {
    navigate("/ShowMarks", { state: { quizName } });
  };

  const handleUpdate = (question_id) => {
    console.log("Update function not yet implemented.", question_id);
  };

  const handleDelete = async (question_id) => {
    try {
      await api.post(
        "/api/creatingquiz/deletequestion",
        { question_id, name: quizName },
        { withCredentials: true }
      );
      setQuestionList(
        questionList.filter((q) => q.question_id !== question_id)
      );
      if (onQuestionsChange) onQuestionsChange(); // Notify parent of changes
      toast.success("Question deleted successfully");
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete question");
    }
  };

  const handleOptionChange = (question_id, optionValue, answer) => {
    console.log("Answer of the question:", answer, optionValue);
  };

  const setQuizForExam = async () => {
    if (!quizName.trim()) {
      toast.error("Please enter a quiz name");
      return;
    }
    setSetupStep(1);
    setCreatedQuiz(null);
  };

  const handleRoundsSubmit = () => {
    if (totalRounds < 1) {
      toast.error("Please enter at least 1 round");
      return;
    }
    setSetupStep(2);
  };

  const handleBuzzerSubmit = () => {
    setSetupStep(3);
  };

  const handleQuestionsSubmit = async () => {
    const isValid = Object.values(roundQuestions).every(
      (r) =>
        typeof r.count === "number" &&
        r.count >= 0 &&
        typeof r.marks === "number" &&
        r.marks >= 0 &&
        typeof r.negative_marks === "number" &&
        r.negative_marks >= 0 &&
        typeof r.skip_marks === "number" &&
        r.skip_marks >= 0
    );

    if (!isValid) {
      toast.error(
        "Please specify valid numbers for questions and marks for each round. All values must be non-negative."
      );
      return;
    }

    const finalRoundQuestionsObject = {};
    for (const roundKey in roundQuestions) {
      finalRoundQuestionsObject[roundKey] = {
        ...roundQuestions[roundKey],
        negative_marks: -Math.abs(roundQuestions[roundKey].negative_marks || 0),
        skip_marks: -Math.abs(roundQuestions[roundKey].skip_marks || 0),
      };
    }

    setIsLoading(true);
    try {
      const response = await api.post(
        "/api/creatingquiz/setQuizNameToFile",
        {
          name: quizName,
          total_rounds: totalRounds,
          has_buzzer_round: hasBuzzerRound,
          round_questions: finalRoundQuestionsObject,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setCreatedQuiz({
          name: quizName,
          totalRounds,
          hasBuzzerRound,
          roundQuestions: finalRoundQuestionsObject,
        });
        setCurrentRound(1);
        setIsFormOpen(true);
      }
    } catch (error) {
      toast.error("Failed to set quiz name");
      console.error("Error setting quiz name for exam:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ... (rest of the component remains unchanged)
  const renderMediaContent = (media) => {
    if (!media?.url) return null;
    const mediaClass =
      "w-full max-w-md mx-auto mb-4 rounded-lg shadow-lg border border-purple-200/30";
    switch (media.type) {
      case "image":
        return (
          <div className="relative group">
            <img src={media.url} alt="Question media" className={mediaClass} />
            <div className="absolute top-2 right-2 bg-purple-500 text-white p-1 rounded-full">
              <FaImage className="w-3 h-3" />
            </div>
          </div>
        );
      case "audio":
        return (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200/30 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FaVolumeUp className="text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                Audio Question
              </span>
            </div>
            <audio src={media.url} controls className="w-full" />
          </div>
        );
      case "video":
        return (
          <div className="relative group mb-4">
            <video
              width="100%"
              height="auto"
              controls
              className="rounded-lg shadow-lg border border-purple-200/30"
            >
              <source src={media.url} type="video/mp4" />
            </video>
            <div className="absolute top-2 right-2 bg-purple-500 text-white p-1 rounded-full">
              <FaPlay className="w-3 h-3" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const updateRoundQuestions = (
    round,
    count,
    marks,
    negative_marks,
    skip_marks
  ) => {
    setRoundQuestions((prev) => ({
      ...prev,
      [`round${round}`]: {
        count: count,
        marks: marks,
        negative_marks: negative_marks,
        skip_marks: skip_marks,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2e1a47] via-[#4a2d6b] to-[#624a82]">
      <NavBar />
      <div className="container mx-auto p-6 pt-24 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Create Quiz
          </h1>
          <p className="text-purple-200 text-lg">
            Design engaging quizzes for your audience
          </p>
        </div>

        {/* Step 0: Quiz Name Input */}
        {setupStep === 0 && (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 mb-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-3">
                Quiz Name
              </label>
              <input
                type="text"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                className="w-full p-4 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-white/60 transition-all duration-300"
                placeholder="Enter an engaging quiz name..."
                required
              />
            </div>
            <button
              onClick={setQuizForExam}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Setting up Quiz...
                </>
              ) : (
                <>
                  <FaPlus className="text-lg" />
                  Set Quiz and Add Questions
                </>
              )}
            </button>
            {/* Display Created Quiz */}
            {createdQuiz && (
              <div className="mt-6 p-4 bg-green-500/20 rounded-xl border border-green-300/30 text-white">
                <h3 className="text-lg font-semibold">Quiz Setup Complete:</h3>
                <p>
                  <strong>Name:</strong> {createdQuiz.name}
                </p>
                <p>
                  <strong>Total Rounds:</strong> {createdQuiz.totalRounds}
                </p>
                <p>
                  <strong>Buzzer Round:</strong>{" "}
                  {createdQuiz.hasBuzzerRound ? "Yes" : "No"}
                </p>
                <h4 className="font-semibold mt-3">Questions per Round:</h4>
                <ul className="list-disc list-inside">
                  {Object.entries(createdQuiz.roundQuestions).map(
                    ([key, value]) => (
                      <li key={key}>
                        {key.replace("round", "Round ")}: {value.count} Qs,{" "}
                        {value.marks} marks, {value.negative_marks} neg,{" "}
                        {value.skip_marks} skip
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Number of Rounds */}
        {setupStep === 1 && (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 mb-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-3">
                Number of Rounds
              </label>
              <input
                type="number"
                value={totalRounds}
                onChange={(e) => setTotalRounds(parseInt(e.target.value) || 1)}
                min="1"
                className="w-full p-4 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-white/60 transition-all duration-300"
                placeholder="Enter number of rounds..."
                required
              />
            </div>
            <button
              onClick={handleRoundsSubmit}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <FaPlus className="text-lg" />
              Next
            </button>
          </div>
        )}

        {/* Step 2: Include Buzzer Round */}
        {setupStep === 2 && (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 mb-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-3">
                Include Buzzer Round?
              </label>
              <select
                value={hasBuzzerRound ? "yes" : "no"}
                onChange={(e) => setHasBuzzerRound(e.target.value === "yes")}
                className="w-full p-4 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-white/60 transition-all duration-300"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            <button
              onClick={handleBuzzerSubmit}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <FaPlus className="text-lg" />
              Next
            </button>
          </div>
        )}

        {/* Step 3: Questions per Round Configuration */}
        {setupStep === 3 && (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 mb-8">
            {Array.from({ length: totalRounds }, (_, i) => i + 1).map(
              (round) => (
                <div key={round} className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Round {round}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Number of Questions"
                      value={roundQuestions[`round${round}`]?.count || ""}
                      onChange={(e) =>
                        updateRoundQuestions(
                          round,
                          parseInt(e.target.value) || 0,
                          roundQuestions[`round${round}`]?.marks || 0,
                          roundQuestions[`round${round}`]?.negative_marks || 0,
                          roundQuestions[`round${round}`]?.skip_marks || 0
                        )
                      }
                      className="w-full p-4 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-white/60 transition-all duration-300"
                    />
                    <input
                      type="number"
                      placeholder="Marks"
                      value={roundQuestions[`round${round}`]?.marks || ""}
                      onChange={(e) =>
                        updateRoundQuestions(
                          round,
                          roundQuestions[`round${round}`]?.count || 0,
                          parseInt(e.target.value) || 0,
                          roundQuestions[`round${round}`]?.negative_marks || 0,
                          roundQuestions[`round${round}`]?.skip_marks || 0
                        )
                      }
                      className="w-full p-4 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-white/60 transition-all duration-300"
                    />
                    <input
                      type="number"
                      placeholder="Negative Marks (Enter as positive, e.g., 1 for -1 mark)"
                      value={
                        roundQuestions[`round${round}`]?.negative_marks || ""
                      }
                      onChange={(e) =>
                        updateRoundQuestions(
                          round,
                          roundQuestions[`round${round}`]?.count || 0,
                          roundQuestions[`round${round}`]?.marks || 0,
                          parseInt(e.target.value) || 0,
                          roundQuestions[`round${round}`]?.skip_marks || 0
                        )
                      }
                      className="w-full p-4 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-white/60 transition-all duration-300"
                    />
                    <input
                      type="number"
                      placeholder="Skip Marks (Enter as positive, e.g., 0.5 for -0.5 mark)"
                      value={roundQuestions[`round${round}`]?.skip_marks || ""}
                      onChange={(e) =>
                        updateRoundQuestions(
                          round,
                          roundQuestions[`round${round}`]?.count || 0,
                          roundQuestions[`round${round}`]?.marks || 0,
                          roundQuestions[`round${round}`]?.negative_marks || 0,
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full p-4 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-white/60 transition-all duration-300"
                    />
                  </div>
                </div>
              )
            )}
            <button
              onClick={handleQuestionsSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Setting up Quiz...
                </>
              ) : (
                <>
                  <FaPlus className="text-lg" />
                  Start Adding Questions
                </>
              )}
            </button>
          </div>
        )}

        {/* Existing Question List Display */}
        <div className="space-y-6">
          {questionList.length > 0 ? (
            questionList.map((item) => {
              const {
                question_id,
                question,
                options,
                media,
                description,
                quizname,
              } = item;
              return (
                <div
                  key={question_id}
                  className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-purple-200 text-sm font-medium px-3 py-1 bg-purple-500/30 rounded-full">
                      {quizname}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpdate(question_id)}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium px-4 py-2 rounded-lg hover:bg-blue-400/20 transition-all duration-300"
                      >
                        <FaEdit className="text-sm" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(question_id)}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium px-4 py-2 rounded-lg hover:bg-red-400/20 transition-all duration-300"
                      >
                        <FaTrashAlt className="text-sm" /> Delete
                      </button>
                    </div>
                  </div>

                  <h2 className="text-2xl text-white font-bold mb-6 leading-relaxed">
                    {question_id}. {question}
                  </h2>

                  {renderMediaContent(media)}

                  {description && (
                    <div className="bg-purple-500/20 p-4 rounded-lg mb-6 border border-purple-300/30">
                      <p className="text-purple-100 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {options &&
                      options.map((opt, idx) => (
                        <div
                          key={idx}
                          className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/10"
                        >
                          <input
                            type="radio"
                            id={`option_${question_id}_${idx}`}
                            name={`${question_id}`}
                            onChange={() =>
                              handleOptionChange(
                                question_id,
                                opt.text,
                                opt.isCorrect
                              )
                            }
                            className="mr-4 w-4 h-4 text-purple-500 bg-transparent border-2 border-purple-300 focus:ring-purple-400 focus:ring-2"
                          />
                          <label
                            htmlFor={`option_${question_id}_${idx}`}
                            className={`text-lg cursor-pointer flex-1 ${
                              opt.isCorrect
                                ? "text-green-300 font-semibold"
                                : "text-white"
                            }`}
                          >
                            {opt.text}
                          </label>
                          {opt.isCorrect && (
                            <span className="text-green-300 text-sm font-medium px-2 py-1 bg-green-500/20 rounded-full">
                              Correct
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl text-purple-300 mb-4">📝</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No Questions Yet
              </h3>
              <p className="text-purple-200 mb-6">
                Start by setting up your quiz and adding questions
              </p>
            </div>
          )}
        </div>

        {/* View Marks Button */}
        {questionList.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleViewMarks}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 mx-auto"
            >
              <FaEye className="text-lg" />
              View Marks
            </button>
          </div>
        )}

        {/* Question Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <QuestionForm
                quizName={quizName}
                roundNumber={currentRound}
                roundConfig={roundQuestions[`round${currentRound}`]}
                onClose={() => {
                  setIsFormOpen(false);
                  if (currentRound < totalRounds) {
                    setCurrentRound((prev) => prev + 1);
                    setIsFormOpen(true); // Re-open for next round
                  } else {
                    setSetupStep(0); // Go back to quiz name setup or a completion step
                    setCurrentRound(1); // Reset round count
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQuiz;
