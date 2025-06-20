import React, { useState, useEffect,useCallback, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Footer from './Footer.js';
import Timerforshowquestion from "./Timerforshowquestion.js";

const QuizBank = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [answers, setAnswers] = useState({});
  const [options, setOptions] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [questions, setQuestions] = useState([]); // Fixed question state handling
  const [quizName,setQuizName] = useState("");
  const [counter,setCounter]=useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { roomKey } = location.state || {};
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/quiz/getQuestion");
        setQuestions(response.data.questions);
       
        console.log(questions[0]);
        setQuizName(response.data.quizName); // Set questions directly
      } catch (err) {
        console.log("Error fetching questions", err);
      }
    };

    fetchData();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('User switched to another tab or window.', counter);
       
        
      } else {
        console.log('Counter when user switched back:', counter);
        
          toast.error("You have been disqualified for switching tabs");
          evaluate();
          navigate('/');
        
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
    setSelectedOptions((prev) => {
      const newSelectedOptions = { ...prev };
      if (newSelectedOptions[currentQuestion] === optionID) {
        delete newSelectedOptions[currentQuestion]; // Deselect the option if it's already selected
        setAnswers((prev) => {
          const newAnswers = { ...prev };
          delete newAnswers[currentQuestion]; // Remove the answer from the answers array
          return newAnswers;
        });
        let n = document.getElementsByClassName('qno')[currentQuestion];
        n.style.background = ''; // Reset the bottom span color to normal
      } else {
        newSelectedOptions[currentQuestion] = optionID; // Select the new option
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion]: ans,
        }));
        let n = document.getElementsByClassName('qno')[currentQuestion];
        n.style.background = 'linear-gradient(180deg,#87ff00,#0b1e07)'; // Set the bottom span color to green
      }
      return newSelectedOptions;
    });

    setOptions((prev) => ({
      ...prev,
      [currentQuestion]: alphabetID,
    }));

  
  };


  const answersArray = (answer) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }));
    console.log(answers);
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
    callbackRef.current = callback; // always updated
    const timeoutRef = useRef(null);
  
    const debouncedFunction = useCallback((...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }, [delay]);
  
    // Clear the timeout if the component unmounts
    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);
  
    return debouncedFunction;
  };

  const evaluate = async () => {
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
      if(questions[i].questiontype=='multiple-choice'){
        if(!answers[i]){
          marks-=0;
          console.log("QUestion not answered",questions[i].question);
        }
     else if (answers[i] === questions[i].answer) {
       marks+=questions[i].marks;
       console.log("QUestion  answered",questions[i].question);
      }
      else{
        console.log("QUestion  answered wrong ",questions[i].question);
        marks+=questions[i].negativemarks;
      }}
      else{
        if(!answers[i]){
          // console.log("QUestion not answered",questions[i].question);
          marks-=0;
        }
       else if (answers[i].toLowerCase() === questions[i].answer.toLowerCase()) {
          marks+=questions[i].marks; console.log("QUestion  answered",questions[i].question);
        }
        
        else{
          marks+=questions[i].negativemarks;
        }
      }
      console.log(marks);
    }

 
      const data = { marks, roomKey ,quizName,timestamp };
      console.log(data);
      const response = await axios.post("http://localhost:5000/quiz/addMarks", { data }, { withCredentials: true });
      console.log(response);
      if (response.data.ok) {
        navigate('/');
        toast.success(response.data.marks);
      }
      else if(response.status!=200){
        toast.error(response.data.marks);
        
        setIsSubmitting(false);
      }
    } 
    catch (error) {
       console.log(error.response.data);
      toast.error("Invalid Submission: " + error.response.data.message);
      setIsSubmitting(false);
    }
  };

  const debouncedEvaluate =useDebouncedCallback(evaluate, 300);
  
  const spans = questions.map((_, index) => (
    <span className="qno" key={index + 1} onClick={() => numberClicked(index)}></span>
  ));

  return (
    <>
      <div className="body-showQuestion">
        <h2 className="text-9xl font-extrabold text-center bg-clip-text text-transparent pt-10"
          style={{ backgroundImage: "url('/images/Trivia NIGHTS (1).png')" }}>{quizName}</h2>
            <Timerforshowquestion  onTimerEnd={evaluate}/>
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
          
         {/* < div className="input-container"> */}
            {questions[currentQuestion]?.questiontype === "fill-in-the-blank" && (
              <input
                type="text"
                value={answers[currentQuestion] || ''}
                onChange={handleFillInTheBlankChange}
                className="fill-in-the-blank"
                placeholder="Type your answer here"
              />

              
              
            )}



        { questions[currentQuestion]?.questiontype=='multiple-choice' && ( <div className="options">
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
            </div> )}
          
              {/* </div> */}
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
