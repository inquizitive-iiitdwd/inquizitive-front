// CreateQuiz.js
import React, { useState, useEffect, useCallback } from 'react';
import { useGlobalcontext } from '../../context/QuizContext.js';
import { FaEdit, FaTrashAlt, FaPlus, FaEye, FaImage, FaPlay, FaVolumeUp, FaCheckCircle, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import toast from 'react-hot-toast';
import api from '../../services/api.js';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../component/NavBar.js';
import QuestionForm from '../../component/QuestionForm.js';

const CreateQuiz = () => {
  const { questions, setQuestions: setGlobalQuestions } = useGlobalcontext();

  const [questionList, setQuestionList] = useState([]);
  const [quizConfig, setQuizConfig] = useState({
    name: '',
    quizId: null, // NEW: Store quizId here
    totalRounds: 1,
    hasBuzzerRound: false,
    roundQuestions: {},
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [setupStep, setSetupStep] = useState(0);
  const [currentRoundForAdding, setCurrentRoundForAdding] = useState(1);
  const [currentQuestionToEdit, setCurrentQuestionToEdit] = useState(null);
  const navigate = useNavigate();

  // Effect to fetch questions once quizName is set and confirmed (after setupStep 2)
  useEffect(() => {
    const fetchQuestionsForQuiz = async () => {
      // Fetch only if quizId is set and we are past the initial setup steps
      if (quizConfig.quizId && setupStep >= 3) { // Use quizConfig.quizId
        setIsLoading(true);
        try {
          // Pass quizName, as backend's `questionsForQuiz` still uses name
          const response = await api.get(`/api/creatingquiz/questionsForQuiz?name=${quizConfig.name}`, { withCredentials: true });
          setQuestionList(response.data);
          setGlobalQuestions(response.data);
        } catch (error) {
          console.error("Error fetching questions for quiz:", error);
          if (error.response?.status === 401 || error.response?.status === 403) {
            toast.error('Unauthorized access. Please log in as an organizer.');
            navigate('/organizer-login');
          }
          setQuestionList([]);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchQuestionsForQuiz();
  }, [quizConfig.name, quizConfig.quizId, setupStep, navigate, setGlobalQuestions]); // Added quizConfig.quizId

  // Initial load: If context already has questions for a quiz, pre-fill quizName and questionList
  useEffect(() => {
    if (questions && questions.length > 0 && questions[0].quizname && !quizConfig.name) {
      setQuizConfig(prev => ({
        ...prev,
        name: questions[0].quizname,
        // Assuming questions[0].quiz_id might be available if loaded from backend previously
        quizId: questions[0].quiz_id || null, // Try to load quizId from existing questions
        // Potentially load existing quiz config (totalRounds, hasBuzzerRound, roundQuestions) from another endpoint if needed for editing existing quizzes
      }));
      setQuestionList(questions);
      setSetupStep(3); // Skip setup if editing an existing quiz
    }
  }, [questions, quizConfig.name]);

  const handleViewMarks = () => {
    if (!quizConfig.name) {
      toast.error('Please set up a quiz name first.');
      return;
    }
    navigate('/ShowMarks', { state: { quizName: quizConfig.name } });
  };

  const handleUpdate = useCallback((questionData) => {
    setCurrentQuestionToEdit(questionData);
    setIsFormOpen(true);
  }, [setCurrentQuestionToEdit, setIsFormOpen]);

  const handleDelete = useCallback(async (question_id) => {
    if (!quizConfig.name || !quizConfig.quizId) { // Ensure quizId is available for delete
      toast.error('Cannot delete: Quiz name or ID not set.');
      return;
    }
    setIsLoading(true);
    try {
      // Delete still uses quiz name for now, as per your controller
      // If your deleteQuestion backend uses quiz_id directly, update this too.
      await api.post("/api/creatingquiz/deletequestion", { question_id, name: quizConfig.name }, { withCredentials: true });
      setQuestionList(prev => prev.filter(q => q._id !== question_id)); // Use _id from MongoDB
      setGlobalQuestions(prev => prev.filter(q => q._id !== question_id)); // Use _id from MongoDB
      toast.success('Question deleted successfully!');
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error('Failed to delete question.');
    } finally {
      setIsLoading(false);
    }
  }, [quizConfig.name, quizConfig.quizId, setQuestionList, setIsLoading, setGlobalQuestions]); // Added quizConfig.quizId

  const handleOptionChange = () => { /* No-op */ };

  const handleQuizNameSubmit = () => {
    if (!quizConfig.name.trim()) {
      toast.error('Please enter a quiz name.');
      return;
    }
    setSetupStep(1);
  };

  const handleRoundsBuzzerSubmit = async () => {
    // Convert to number for validation
    const totalRoundsNum = parseInt(quizConfig.totalRounds);
    if (isNaN(totalRoundsNum) || totalRoundsNum < 1) {
      toast.error('Number of rounds must be at least 1.');
      return;
    }
    // Initialize or update is_buzzer_round for each round when moving to step 2
    setQuizConfig(prev => {
        const newRoundQuestions = { ...prev.roundQuestions };
        for (let i = 1; i <= totalRoundsNum; i++) {
            const roundKey = `round${i}`;
            newRoundQuestions[roundKey] = {
                ...newRoundQuestions[roundKey],
                is_buzzer_round: newRoundQuestions[roundKey]?.is_buzzer_round ?? false
            };
        }
        return { ...prev, totalRounds: totalRoundsNum, roundQuestions: newRoundQuestions };
    });
    setSetupStep(2);
  };

  const handleQuestionsPerRoundSubmit = async () => {
    const finalRoundQuestions = {};
    let isValid = true;

    for (let i = 1; i <= quizConfig.totalRounds; i++) {
      const roundKey = `round${i}`;
      const config = quizConfig.roundQuestions[roundKey] || {};

      const count = config.count === '' ? 0 : parseInt(config.count) || 0;
      const marks = config.marks === '' ? 0 : parseInt(config.marks) || 0;
      const negative_marks = config.negative_marks === '' ? 0 : parseInt(config.negative_marks) || 0;
      const skip_marks = config.skip_marks === '' ? 0 : parseFloat(config.skip_marks) || 0;
      const is_buzzer_round = config.is_buzzer_round || false;

      if (isNaN(count) || count < 0 ||
          isNaN(marks) || marks < 0 ||
          isNaN(negative_marks) || negative_marks < 0 ||
          isNaN(skip_marks) || skip_marks < 0) {
        isValid = false;
        break;
      }

      finalRoundQuestions[roundKey] = {
        count: count,
        marks: marks,
        negative_marks: -Math.abs(negative_marks),
        skip_marks: -Math.abs(skip_marks),
        is_buzzer_round: is_buzzer_round,
      };
    }

    if (!isValid) {
      toast.error('Please specify valid non-negative numbers for questions, marks, negative marks, and skip marks for ALL rounds.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/api/creatingquiz/setQuizNameToFile", {
        name: quizConfig.name,
        total_rounds: quizConfig.totalRounds,
        has_buzzer_round: quizConfig.hasBuzzerRound,
        round_questions: finalRoundQuestions
      }, { withCredentials: true });

      if (response.status === 200) {
        console.log("Response from /setQuizNameToFile:", response.data);
        console.log("Quiz ID received:", response.data.quiz_id);
        toast.success(response.data.message || 'Quiz setup successfully!');
        setQuizConfig(prev => ({ // Capture quiz_id from response
          ...prev,
          quizId: response.data.quiz_id, // Store the new quiz ID
          roundQuestions: finalRoundQuestions
        }));
        setSetupStep(3);
        setCurrentRoundForAdding(1);
        if (finalRoundQuestions.round1 && finalRoundQuestions.round1.count > 0) {
          setIsFormOpen(true);
        } else {
          toast('Round 1 has 0 questions configured. You can add questions manually later.');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to finalize quiz setup.');
      console.error("Error setting quiz configuration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMediaContent = (media) => {
    if (!media?.url) return null;
    const mediaClass = "w-full max-w-md mx-auto mb-4 rounded-lg shadow-lg border border-purple-200/30";
    switch (media.type) {
      case 'image':
        return (
          <div className="relative group">
            <img src={media.url} alt="Question media" className={mediaClass} />
            <div className="absolute top-2 right-2 bg-purple-500 text-white p-1 rounded-full">
              <FaImage className="w-3 h-3" />
            </div>
          </div>
        );
      case 'audio':
        return (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200/30 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FaVolumeUp className="text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Audio Question</span>
            </div>
            <audio src={media.url} controls className="w-full" />
          </div>
        );
      case 'video':
        return (
          <div className="relative group mb-4">
            <video width="100%" height="auto" controls className="rounded-lg shadow-lg border border-purple-200/30">
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

  const updateRoundQuestionsConfig = useCallback((round, key, value) => {
    setQuizConfig(prev => {
      const currentRoundData = prev.roundQuestions[`round${round}`] || {};
      return {
        ...prev,
        roundQuestions: {
          ...prev.roundQuestions,
          [`round${round}`]: {
            ...currentRoundData,
            [key]: value,
          },
        },
      };
    });
  }, []);

  const handleQuestionFormClose = useCallback(() => {
    setIsFormOpen(false);
    setCurrentQuestionToEdit(null);

    const questionsInCurrentRound = questionList.filter(q => q.round === currentRoundForAdding && q.quizname === quizConfig.name).length;
    const currentRoundConfig = quizConfig.roundQuestions[`round${currentRoundForAdding}`];
    const expectedQuestionCount = currentRoundConfig?.count === '' ? 0 : parseInt(currentRoundConfig?.count) || 0;

    if (questionsInCurrentRound < expectedQuestionCount) {
      toast(`Add more questions for Round ${currentRoundForAdding}. ${questionsInCurrentRound}/${expectedQuestionCount} added.`);
      setIsFormOpen(true);
    } else if (currentRoundForAdding < quizConfig.totalRounds) {
      setCurrentRoundForAdding(prev => prev + 1);
      toast.success(`Round ${currentRoundForAdding} complete! Moving to Round ${currentRoundForAdding + 1}.`);
      const nextRoundConfig = quizConfig.roundQuestions[`round${currentRoundForAdding + 1}`];
      const nextRoundExpectedCount = nextRoundConfig?.count === '' ? 0 : parseInt(nextRoundConfig?.count) || 0;

      if (nextRoundConfig && nextRoundExpectedCount > 0) {
        setIsFormOpen(true);
      } else {
        toast.info(`Round ${currentRoundForAdding + 1} has 0 questions configured. Moving to next round if available.`);
        let nextNonEmptyRound = currentRoundForAdding + 2;
        let foundNextRound = false;
        while(nextNonEmptyRound <= quizConfig.totalRounds){
          const roundToCheck = quizConfig.roundQuestions[`round${nextNonEmptyRound}`];
          const roundToCheckExpectedCount = roundToCheck?.count === '' ? 0 : parseInt(roundToCheck?.count) || 0;

          if(roundToCheck && roundToCheckExpectedCount > 0){
            setCurrentRoundForAdding(nextNonEmptyRound);
            toast.success(`Skipping empty rounds. Moving to Round ${nextNonEmptyRound}.`);
            setIsFormOpen(true);
            foundNextRound = true;
            break;
          }
          nextNonEmptyRound++;
        }
        if(!foundNextRound){
          toast.success('All configured questions added for relevant rounds. You can add more manually if needed.');
          setSetupStep(0);
          setCurrentRoundForAdding(1);
        }
      }
    } else {
      toast.success('All configured questions added for relevant rounds. Quiz creation complete!');
      setSetupStep(0);
      setCurrentRoundForAdding(1);
    }
  }, [quizConfig, currentRoundForAdding, questionList, setCurrentRoundForAdding, setCurrentQuestionToEdit, setIsFormOpen, setSetupStep]);

  const handleAddQuestionClick = () => {
    if (!quizConfig.name || !quizConfig.quizId) { // Check for quizId before allowing question add
      toast.error('Please complete the quiz setup (including naming and saving) first.');
      return;
    }
    const currentRoundConfig = quizConfig.roundQuestions[`round${currentRoundForAdding}`];
    const expectedCountForCurrentRound = currentRoundConfig?.count === '' ? 0 : parseInt(currentRoundConfig?.count) || 0;

    if (!currentRoundConfig || expectedCountForCurrentRound === 0) {
      toast.info(`Round ${currentRoundForAdding} is configured for 0 questions. You can still add questions, but they won't count towards the configured number for this round.`);
      setIsFormOpen(true);
      return;
    }
    setIsFormOpen(true);
    setCurrentQuestionToEdit(null);
  };

  const handleResetQuizCreation = () => {
    setQuizConfig({
      name: '',
      quizId: null, // Reset quizId
      totalRounds: 1,
      hasBuzzerRound: false,
      roundQuestions: {},
    });
    setQuestionList([]);
    setIsFormOpen(false);
    setIsLoading(false);
    setSetupStep(0);
    setCurrentRoundForAdding(1);
    setCurrentQuestionToEdit(null);
    toast.info('Quiz creation reset. Start a new quiz!');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#2e1a47] via-[#4a2d6b] to-[#624a82]'>
      <NavBar />
      <div className='container mx-auto p-6 pt-24 max-w-4xl'>
        <div className="text-center mb-8">
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-2'>
            Create Quiz
          </h1>
          <p className="text-purple-200 text-lg">
            Design engaging quizzes for your audience
          </p>
        </div>

        {/* Quiz Setup Progress Indicator */}
        <div className="flex justify-center items-center space-x-4 mb-10">
          {[0, 1, 2, 3].map((step) => (
            <div key={step} className={`flex items-center space-x-2 ${setupStep >= step ? 'text-white' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold
                ${setupStep > step ? 'bg-green-500' : setupStep === step ? 'bg-purple-600' : 'bg-gray-700'}`}>
                {setupStep > step ? <FaCheckCircle className="text-sm" /> : step + 1}
              </div>
              <span className="hidden sm:inline text-sm">
                {step === 0 && 'Name'}
                {step === 1 && 'Rounds'}
                {step === 2 && 'Scoring'}
                {step === 3 && 'Questions'}
              </span>
            </div>
          ))}
        </div>

        {/* Step 0: Quiz Name Input */}
        {setupStep === 0 && (
          <div className='bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 mb-8'>
            <h2 className="text-3xl font-bold text-white mb-6">1. Name Your Quiz</h2>
            <div className='mb-6'>
              <label htmlFor="quizNameInput" className='block text-sm font-semibold text-white mb-3'>
                Quiz Name
              </label>
              <input
                id="quizNameInput"
                type='text'
                value={quizConfig.name}
                onChange={(e) => setQuizConfig(prev => ({ ...prev, name: e.target.value }))}
                className='w-full p-4 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-white/60 transition-all duration-300 focus:bg-white/50 focus:text-gray-900'
                placeholder='Enter an engaging quiz name...'
                required
              />
            </div>
            <button
              onClick={handleQuizNameSubmit}
              disabled={isLoading}
              className='w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3'
            >
              <FaChevronRight className="text-lg" />
              Next: Configure Rounds
            </button>
          </div>
        )}

        {/* Step 1: Number of Rounds & Buzzer */}
        {setupStep === 1 && (
          <div className='bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 mb-8'>
            <h2 className="text-3xl font-bold text-white mb-6">2. Configure Rounds</h2>
            <div className='mb-6'>
              <label htmlFor="totalRoundsInput" className='block text-sm font-semibold text-white mb-3'>
                Number of Rounds
              </label>
              <input
                id="totalRoundsInput"
                type='number'
                value={quizConfig.totalRounds}
                onChange={(e) => setQuizConfig(prev => ({ ...prev, totalRounds: e.target.value }))} // Store as string
                min='1'
                className='w-full p-4 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-white/60 transition-all duration-300 focus:bg-white/50 focus:text-gray-900'
                placeholder='Enter number of rounds...'
                required
              />
            </div>
            <div className='mb-8'>
              <label htmlFor="buzzerRoundSelect" className='block text-sm font-semibold text-white mb-3'>
                Include Buzzer Round in ANY of the rounds?
              </label>
              <select
                id="buzzerRoundSelect"
                value={quizConfig.hasBuzzerRound ? 'yes' : 'no'}
                onChange={(e) => setQuizConfig(prev => ({ ...prev, hasBuzzerRound: e.target.value === 'yes' }))}
                className='w-full p-4 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-white/60 transition-all duration-300'
              >
                <option value='no' className="bg-[#4a2d6b] text-white">No</option>
                <option value='yes' className="bg-[#4a2d6b] text-white">Yes</option>
              </select>
            </div>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setSetupStep(0)}
                className='flex-1 bg-gray-600 text-white font-bold px-6 py-4 rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3'
              >
                <FaChevronLeft className="text-lg" />
                Back
              </button>
              <button
                onClick={handleRoundsBuzzerSubmit}
                className='flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3'
              >
                Next: Set Scoring <FaChevronRight className="text-lg" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Questions per Round Configuration */}
        {setupStep === 2 && (
          <div className='bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 mb-8'>
            <h2 className="text-3xl font-bold text-white mb-6">3. Set Questions & Scoring per Round</h2>
            {Array.from({ length: quizConfig.totalRounds }, (_, i) => i + 1).map(round => (
              <div key={round} className='mb-8 p-6 bg-white/5 rounded-xl border border-white/10'>
                <div className="flex justify-between items-center mb-4">
                    <h3 className='text-xl font-semibold text-white'>Round {round} Details</h3>
                    {quizConfig.hasBuzzerRound && (
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={`buzzerRound_${round}`}
                                checked={quizConfig.roundQuestions[`round${round}`]?.is_buzzer_round || false}
                                onChange={(e) => updateRoundQuestionsConfig(round, 'is_buzzer_round', e.target.checked)}
                                className="form-checkbox h-5 w-5 text-purple-600 transition duration-150 ease-in-out"
                            />
                            <label htmlFor={`buzzerRound_${round}`} className="text-gray-300">Buzzer Round</label>
                        </div>
                    )}
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-300 mb-1'>Number of Questions</label>
                    <input
                      type='number'
                      placeholder='e.g., 10'
                      value={quizConfig.roundQuestions[`round${round}`]?.count ?? ''}
                      onChange={(e) => updateRoundQuestionsConfig(round, 'count', e.target.value)}
                      min='0'
                      className='w-full p-3 bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-white/60 transition-all duration-300 focus:bg-white/50 focus:text-gray-900'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-300 mb-1'>Marks per Question</label>
                    <input
                      type='number'
                      placeholder='e.g., 5'
                      value={quizConfig.roundQuestions[`round${round}`]?.marks ?? ''}
                      onChange={(e) => updateRoundQuestionsConfig(round, 'marks', e.target.value)}
                      min='0'
                      className='w-full p-3 bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-white/60 transition-all duration-300 focus:bg-white/50 focus:text-gray-900'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-300 mb-1'>Negative Marks (e.g., enter 1 for -1 mark, 0 for no penalty)</label>
                    <input
                      type='number'
                      placeholder='e.g., 1 (0 for no penalty or leave empty)'
                      value={quizConfig.roundQuestions[`round${round}`]?.negative_marks ?? ''}
                      onChange={(e) => updateRoundQuestionsConfig(round, 'negative_marks', e.target.value)}
                      min='0'
                      className='w-full p-3 bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-white/60 transition-all duration-300 focus:bg-white/50 focus:text-gray-900'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-300 mb-1'>Skip Marks (e.g., enter 0.5 for -0.5 mark, 0 for no penalty)</label>
                    <input
                      type='number'
                      placeholder='e.g., 0.5 (0 for no penalty or leave empty)'
                      value={quizConfig.roundQuestions[`round${round}`]?.skip_marks ?? ''}
                      onChange={(e) => updateRoundQuestionsConfig(round, 'skip_marks', e.target.value)}
                      min='0'
                      step='0.1'
                      className='w-full p-3 bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-white/60 transition-all duration-300 focus:bg-white/50 focus:text-gray-900'
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setSetupStep(1)}
                className='flex-1 bg-gray-600 text-white font-bold px-6 py-4 rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3'
              >
                <FaChevronLeft className="text-lg" />
                Back
              </button>
              <button
                onClick={handleQuestionsPerRoundSubmit}
                disabled={isLoading}
                className='flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3'
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Finalizing Setup...
                  </>
                ) : (
                  <>
                    Finalize Setup <FaChevronRight className="text-lg" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Question List & Add Question Button */}
        {setupStep === 3 && (
          <>
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 mb-8">
              <h2 className="text-3xl font-bold text-white">
                Questions for <span className="text-purple-300">{quizConfig.name}</span>
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleAddQuestionClick}
                  className='bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2'
                >
                  <FaPlus className="text-lg" />
                  Add Question
                </button>
                <button
                  onClick={handleResetQuizCreation}
                  className='bg-red-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2'
                  title="Start a new quiz from scratch"
                >
                  <FaTimes className="text-lg" />
                  Reset Quiz
                </button>
              </div>
            </div>

            {/* Existing Question List Display */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-white font-medium">Loading questions...</p>
                </div>
              ) : questionList.length > 0 ? (
                questionList.map((item) => {
                  // Destructure is_buzzer_round from item
                  const { _id, question, options, media, description, quizname, round_number, is_buzzer_round } = item;
                  return (
                    <div key={_id} className='bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300'>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className='text-purple-200 text-sm font-medium px-3 py-1 bg-purple-500/30 rounded-full'>
                            {quizname}
                          </span>
                          {round_number && (
                            <span className='text-blue-200 text-sm font-medium px-3 py-1 bg-blue-500/30 rounded-full'>
                              Round {round_number}
                            </span>
                          )}
                          {/* Display Buzzer Round tag if true */}
                          {is_buzzer_round && (
                            <span className='text-orange-200 text-sm font-medium px-3 py-1 bg-orange-500/30 rounded-full'>
                                Buzzer Round
                            </span>
                          )}
                        </div>
                        <div className='flex items-center gap-3'>
                          <button
                            onClick={() => handleUpdate(item)}
                            className='flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium px-4 py-2 rounded-lg hover:bg-blue-400/20 transition-all duration-300'
                          >
                            <FaEdit className='text-sm' /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(_id)}
                            className='flex items-center gap-2 text-red-400 hover:text-red-300 font-medium px-4 py-2 rounded-lg hover:bg-red-400/20 transition-all duration-300'
                          >
                            <FaTrashAlt className='text-sm' /> Delete
                          </button>
                        </div>
                      </div>

                      <h2 className='text-2xl text-white font-bold mb-6 leading-relaxed'>
                        {item.index}. {question}
                      </h2>

                      {renderMediaContent(media)}

                      {description && (
                        <div className="bg-purple-500/20 p-4 rounded-lg mb-6 border border-purple-300/30">
                          <p className='text-purple-100 leading-relaxed'>{description}</p>
                        </div>
                      )}

                      <div className='space-y-3'>
                        {options && options.map((opt, idx) => (
                          <div key={idx} className='flex items-center p-3 bg-white/10 rounded-lg transition-all duration-300 border border-white/10'>
                            <input
                              type='radio' // Using radio for display only, even for multi-correct
                              id={`option_${_id}_${idx}`}
                              name={`${_id}`}
                              onChange={() => handleOptionChange()}
                              checked={opt.isCorrect} // Highlight correct answer
                              className='mr-4 w-4 h-4 text-purple-500 bg-transparent border-2 border-purple-300 focus:ring-purple-400 focus:ring-2 pointer-events-none'
                            />
                            <label
                              htmlFor={`option_${_id}_${idx}`}
                              className={`text-lg flex-1 ${opt.isCorrect ? 'text-green-300 font-semibold' : 'text-white'}`}
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
                  <h3 className="text-2xl font-bold text-white mb-2">No Questions Yet</h3>
                  <p className="text-purple-200 mb-6">
                    Start by clicking "Add Question" to populate your quiz.
                    <br />
                    You are currently adding questions for Round {currentRoundForAdding}.
                  </p>
                </div>
              )}
            </div>

            {/* View Marks Button */}
            {questionList.length > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleViewMarks}
                  className='bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 mx-auto'
                >
                  <FaEye className="text-lg" />
                  View Marks
                </button>
              </div>
            )}
          </>
        )}


        {/* Question Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-full h-full max-w-full max-h-full overflow-y-auto custom-scrollbar">
              <QuestionForm
                quizName={quizConfig.name}
                quizId={quizConfig.quizId} // Pass quizId to QuestionForm
                roundNumber={currentRoundForAdding}
                roundConfig={quizConfig.roundQuestions[`round${currentRoundForAdding}`]}
                initialData={currentQuestionToEdit}
                onQuestionAddedOrUpdated={(newQuestion) => {
                  if (currentQuestionToEdit) {
                    setQuestionList(prev => prev.map(q => q._id === newQuestion._id ? newQuestion : q)); // Use _id
                  } else {
                    setQuestionList(prev => [...prev, newQuestion]);
                  }
                  setGlobalQuestions(prev => {
                    const existingIndex = prev.findIndex(q => q._id === newQuestion._id); // Use _id
                    if (existingIndex > -1) {
                      return prev.map(q => q._id === newQuestion._id ? newQuestion : q); // Use _id
                    }
                    return [...prev, newQuestion];
                  });
                  handleQuestionFormClose();
                }}
                onClose={() => {
                  setIsFormOpen(false);
                  setCurrentQuestionToEdit(null);
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