import React, { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Footer from './footer.js';


const QuizBank = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [answers, setAnswers] = useState({});
  const [options, setOptions] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [questions, setQuestions] = useState([]); // Fixed question state handling
  const [quizName,setQuizName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { roomKey } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://inquizitive-web.onrender.com/quiz/getQuestion");
        setQuestions(response.data.questions);
        setQuizName(response.data.quizName); // Set questions directly
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
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQuestion]: optionID,
    }));

    setOptions((prev) => ({
      ...prev,
      [currentQuestion]: alphabetID,
    }));

    let n = document.getElementsByClassName('qno')[currentQuestion];
    answersArray(ans);
    n.style.background = 'linear-gradient(180deg,#87ff00,#0b1e07)';
  };

  const answersArray = (answer) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }));
  };

  const evaluate = async () => {
    let marks = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].answer) {
       marks+=questions[i].marks
      }
      else{
        marks-=questions[i].negativeMarks
      }
    }

    try {
      const data = { marks, roomKey ,quizName };
      const response = await axios.post("https://inquizitive-web.onrender.com/quiz/addMarks", { data }, { withCredentials: true });
      toast.success(response.data.remarks);
      if (response.data.ok) {
        navigate('/');
      }
    } catch (error) {
      toast.error("Invalid Submission");
    }
  };

  const spans = questions.map((_, index) => (
    <span className="qno" key={index + 1} onClick={() => numberClicked(index)}></span>
  ));

  return (
    <>
      <div className="body-showQuestion">
        <h2 className="text-8xl font-extrabold text-center bg-clip-text text-transparent pt-10"
          style={{ backgroundImage: "url('/images/Trivia NIGHTS (1).png')" }}>Orientation Special</h2>
        <div className="quiz">
          <div className="question-card">
            <div className="question-text">
              {questions.length > 0 && <h3 className='quiz-question'>{questions[currentQuestion]?.question}</h3>}

              {/* Conditional Rendering for file types */}
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

            <div className="options">
              <ul className="list-options">
                {questions[currentQuestion]?.options1 && (
                  <div className="option-container">
                    <span id={`optionsA_${questions[currentQuestion].id}`}
                      className="alphabet w-50 h-50"
                      onClick={(e) => questionOptClicked(`options1_${questions[currentQuestion].id}`, questions[currentQuestion].options1, `optionsA_${questions[currentQuestion].id}`)}
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
                      onClick={(e) => questionOptClicked(`options2_${questions[currentQuestion].id}`, questions[currentQuestion].options2, `optionsB_${questions[currentQuestion].id}`)}
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
                      onClick={(e) => questionOptClicked(`options3_${questions[currentQuestion].id}`, questions[currentQuestion].options3, `optionsC_${questions[currentQuestion].id}`)}
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
                      onClick={(e) => questionOptClicked(`options4_${questions[currentQuestion].id}`, questions[currentQuestion].options4, `optionsD_${questions[currentQuestion].id}`)}
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

                {/* Repeat similar blocks for other options */}
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
          </div>
        </div>

        <div className="question-numbers flex flex-row gap-2.5 h-20 w-24 mx-[30rem]">
          {spans}
        </div>

        <div className="flex justify-center my-5">
          <button
            onClick={evaluate}
            className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Submit
          </button>
        </div>

        <Toaster />
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setIsModalOpen(false)}>
              &times;
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
