import React, { useState, useEffect, useCallback, useRef } from "react";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from "../../services/api.js";
import { useLocation } from 'react-router-dom';
import Footer from '../../component/Footer.js';
import Timerforshowquestion from "../../component/Timerforshowquestion.js";

const QuizBank = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [answers, setAnswers] = useState({});
  const [options, setOptions] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [quizName, setQuizName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { roomKey } = location.state || {};

  const evaluate = useCallback(async () => {
    console.log("Evaluation will go on");
    setIsSubmitting(true);
    try {
      console.log(answers);
      let marks = 0;
      const now = new Date();
      const istTime = new Date(now.toLocaleString("en-GB", { timeZone: "Asia/Kolkata" }));
      const timestamp = `${istTime.getHours().toString().padStart(2, "0")}:${istTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${istTime
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;
      console.log(timestamp);

      for (let i = 0; i < questions.length; i++) {
        if (questions[i].questiontype === 'multiple-choice') {
          if (!answers[i]) {
            marks -= 0;
            console.log("Question not answered", questions[i].question);
          } else if (answers[i] === questions[i].answer) {
            marks += questions[i].marks;
            console.log("Question answered", questions[i].question);
          } else {
            console.log("Question answered wrong", questions[i].question);
            marks += questions[i].negativemarks;
          }
        } else {
          if (!answers[i]) {
            marks -= 0;
          } else if (answers[i].toLowerCase() === questions[i].answer.toLowerCase()) {
            marks += questions[i].marks;
            console.log("Question answered", questions[i].question);
          } else {
            marks += questions[i].negativemarks;
          }
        }
        console.log(marks);
      }

      const data = { marks, roomKey, quizName, timestamp };
      console.log(data);
      const response = await api.post("/quiz/addMarks", { data }, { withCredentials: true });
      console.log(response);
      if (response.data.ok) {
        navigate('/');
        toast.success(response.data.marks);
      } else if (response.status !== 200) {
        toast.error(response.data.marks);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error("Invalid Submission: " + error.response.data.message);
      setIsSubmitting(false);
    }
  }, [navigate, questions, answers, roomKey, quizName, setIsSubmitting]); // Dependencies

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/quizzes/${quizName}/questions`);
        setQuestions(response.data.questions);
        setQuizName(response.data.quizName);
      } catch (err) {
        console.log("Error fetching questions", err);
      }
    };

    fetchData();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('User switched to another tab or window.');
      } else {
        console.log('User switched back to this tab.');
        toast.error("You have been disqualified for switching tabs");
        evaluate();
        navigate('/');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate, evaluate, questions, quizName]);

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const numberClicked = (i) => {
    setCurrentQuestion(i);
  };

  const questionOptClicked = (optionID, ans, alphabetID) => {
    setSelectedOptions((prev) => {
      const newSelectedOptions = { ...prev };
      if (newSelectedOptions[currentQuestion] === optionID) {
        delete newSelectedOptions[currentQuestion];
        setAnswers((prev) => {
          const newAnswers = { ...prev };
          delete newAnswers[currentQuestion];
          return newAnswers;
        });
        let n = document.getElementsByClassName('qno')[currentQuestion];
        n.style.background = '';
      } else {
        newSelectedOptions[currentQuestion] = optionID;
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion]: ans,
        }));
        let n = document.getElementsByClassName('qno')[currentQuestion];
        n.style.background = 'linear-gradient(180deg,#87ff00,#0b1e07)';
      }
      return newSelectedOptions;
    });

    setOptions((prev) => ({
      ...prev,
      [currentQuestion]: alphabetID,
    }));
  };

  const handleFillInTheBlankChange = (e) => {
    const answer = e.target.value;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }));

    let n = document.getElementsByClassName('qno')[currentQuestion];
    if (answer.trim() !== '') {
      n.style.background = 'linear-gradient(180deg,#87ff00,#0b1e07)';
    } else {
      n.style.background = '';
    }
  };

  const useDebouncedCallback = (callback, delay) => {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;
    const timeoutRef = useRef(null);

    const debouncedFunction = useCallback((...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }, [delay]);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    return debouncedFunction;
  };

  const debouncedEvaluate = useDebouncedCallback(evaluate, 300);

  const spans = questions.map((_, index) => (
    <span className="qno" key={index + 1} onClick={() => numberClicked(index)}></span>
  ));

  return (
    <>
      <div className="body-showQuestion">
        <h2 className="text-9xl font-extrabold text-center bg-clip-text text-transparent pt-10"
          style={{ backgroundImage: "url('/images/Trivia NIGHTS (1).png')" }}>{quizName}</h2>
        <Timerforshowquestion onTimerEnd={evaluate} />
        <div className="quiz">
          <div className="question-card">
            <div className="question-text">
              {questions.length > 0 && <h3 className='quiz-question'>{questions[currentQuestion]?.question}</h3>}

              {questions[currentQuestion]?.file_type === "image" && (
                <button onClick={() => {
                  setModalContent(
                    <img
                      src={questions[currentQuestion].file_url}
                      className="w-full h-auto max-w-md mb-4 border rounded shadow-md"
                      alt="Question related"
                    />
                  );
                  setIsModalOpen(true);
                }}>
                  View Image
                </button>
              )}

              {questions[currentQuestion]?.file_type === "audio" && (
                <button onClick={() => {
                  setModalContent(
                    <audio src={questions[currentQuestion].file_url} controls autoPlay />
                  );
                  setIsModalOpen(true);
                }}>
                  Play Audio
                </button>
              )}

              {questions[currentQuestion]?.file_type === "video" && (
                <button onClick={() => {
                  setModalContent(
                    <video width="750" height="500" controls>
                      <source src={questions[currentQuestion].file_url} type="video/mp4" />
                    </video>
                  );
                  setIsModalOpen(true);
                }}>
                  Play Video
                </button>
              )}
            </div>
            {questions[currentQuestion]?.questiontype === "fill-in-the-blank" && (
              <input
                type="text"
                value={answers[currentQuestion] || ''}
                onChange={handleFillInTheBlankChange}
                className="fill-in-the-blank"
                placeholder="Type your answer here"
              />
            )}
            {questions[currentQuestion]?.questiontype === 'multiple-choice' && (
              <div className="options">
                <ul className="list-options">
                  {questions[currentQuestion]?.options1 && (
                    <div className="option-container">
                      <span id={`optionsA_${questions[currentQuestion].id}`}
                        className="alphabet w-50 h-50"
                        onClick={() => questionOptClicked(`options1_${questions[currentQuestion].id}`, questions[currentQuestion].options1, `optionsA_${questions[currentQuestion].id}`)}
                        style={{
                          border: options[currentQuestion] === `optionsA_${questions[currentQuestion].id}` ? '7px solid green' : '2px solid white',
                        }}>A</span>
                      <li id={`options1_${questions[currentQuestion].id}`}
                        onClick={(e) => questionOptClicked(e.target.id, questions[currentQuestion].options1, `optionsA_${questions[currentQuestion].id}`)}
                        className='option'
                        style={{
                          border: selectedOptions[currentQuestion] === `options1_${questions[currentQuestion].id}` ? '7px solid green' : '2px solid white',
                        }}>
                        {questions[currentQuestion].options1}
                      </li>
                    </div>
                  )}

                  {questions[currentQuestion]?.options2 && (
                    <div className="option-container">
                      <span id={`optionsB_${questions[currentQuestion].id}`}
                        className="alphabet w-50 h-50"
                        onClick={() => questionOptClicked(`options2_${questions[currentQuestion].id}`, questions[currentQuestion].options2, `optionsB_${questions[currentQuestion].id}`)}
                        style={{
                          border: options[currentQuestion] === `optionsB_${questions[currentQuestion].id}` ? '7px solid green' : '2px solid white',
                        }}>B</span>
                      <li id={`options2_${questions[currentQuestion].id}`}
                        onClick={(e) => questionOptClicked(e.target.id, questions[currentQuestion].options2, `optionsB_${questions[currentQuestion].id}`)}
                        className='option'
                        style={{
                          border: selectedOptions[currentQuestion] === `options2_${questions[currentQuestion].id}` ? '7px solid green' : '2px solid white',
                        }}>
                        {questions[currentQuestion].options2}
                      </li>
                    </div>
                  )}

                  {questions[currentQuestion]?.options3 && (
                    <div className="option-container">
                      <span id={`optionsC_${questions[currentQuestion].id}`}
                        className="alphabet w-50 h-50"
                        onClick={() => questionOptClicked(`options3_${questions[currentQuestion].id}`, questions[currentQuestion].options3, `optionsC_${questions[currentQuestion].id}`)}
                        style={{
                          border: options[currentQuestion] === `optionsC_${questions[currentQuestion].id}` ? '7px solid green' : '2px solid white',
                        }}>C</span>
                      <li id={`options3_${questions[currentQuestion].id}`}
                        onClick={(e) => questionOptClicked(e.target.id, questions[currentQuestion].options3, `optionsC_${questions[currentQuestion].id}`)}
                        className='option'
                        style={{
                          border: selectedOptions[currentQuestion] === `options3_${questions[currentQuestion].id}` ? '7px solid green' : '2px solid white',
                        }}>
                        {questions[currentQuestion].options3}
                      </li>
                    </div>
                  )}
                  {questions[currentQuestion]?.options4 && (
                    <div className="option-container">
                      <span id={`optionsD_${questions[currentQuestion].id}`}
                        className="alphabet w-50 h-50"
                        onClick={() => questionOptClicked(`options4_${questions[currentQuestion].id}`, questions[currentQuestion].options4, `optionsD_${questions[currentQuestion].id}`)}
                        style={{
                          border: options[currentQuestion] === `optionsD_${questions[currentQuestion].id}` ? '7px solid green' : '2px solid white',
                        }}>D</span>
                      <li id={`options4_${questions[currentQuestion].id}`}
                        onClick={(e) => questionOptClicked(e.target.id, questions[currentQuestion].options4, `optionsD_${questions[currentQuestion].id}`)}
                        className='option'
                        style={{
                          border: selectedOptions[currentQuestion] === `options4_${questions[currentQuestion].id}` ? '7px solid green' : '2px solid white',
                        }}>
                        {questions[currentQuestion].options4}
                      </li>
                    </div>
                  )}
                </ul>
                <div className="buttons">
                  <button id='prev-question' onClick={previousQuestion}>
                    {"<"}
                  </button>
                  <button id='next-question' onClick={nextQuestion}>
                    {">"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="question-numbers">
        {spans}
      </div>

      <div className="flex justify-center my-5">
        <button
          onClick={debouncedEvaluate} disabled={isSubmitting}
          className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setIsModalOpen(false)}>
              ×
            </button>
            {modalContent}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default QuizBank;