import React, { useState, useEffect } from 'react';
import { useGlobalcontext } from './contex.js';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
// import ShowMarks from './showMarks';

const Createquizquestion = ({ onQuestionsChange }) => {
  const { questions } = useGlobalcontext();
  const [myArray, setMyArray] = useState([]);
  const [questionList, setQuestionList] = useState(questions);
  const [quiznameforconformation, setQuizNameForConformation]=useState('')
  const [quizName, setQuizName] = useState(''); // Assuming you have a state for quizName
  // const [showMarks, setShowMarks] = useState(false);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://inquizitive-web.onrender.com/quizsetup/questionForonequiz");
        setQuestionList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [questions]);

  // const handleViewMarks = () => {
  //   setShowMarks(true);
  // };
  
  const handleViewMarks = () => {
    navigate('/show-marks', { state: { quizName } });
  };

  const handleUpdate = (question_id) => {
    console.log("Update function not yet implemented.", question_id);
  };

  const handleDelete = async (question_id) => {
    try {
      await axios.post("https://inquizitive-web.onrender.com/quiz/deletequestion", { question_id });
      setQuestionList(questionList.filter(q => q.question_id !== question_id));
      onQuestionsChange();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleOptionChange = (question_id, optionValue, answer) => {
    console.log("Answer of the question:", answer, optionValue);
    setMyArray(prevArray => [...prevArray, { question_id, selectedOption: optionValue }]);
  };

  const setQuizForExam = async () => {
    try {
      const name = quiznameforconformation;
      const response=await axios.post("https://inquizitive-web.onrender.com/quiz/setQuizNameToFile", { name });
      console.log("Quiz name set for the exam:", response.status);
      if(response.status===200){
        setQuizNameForConformation('')
        toast.success(response.data.message)
      }
    } catch (error) {
      console.error("Error setting quiz name for exam:", error);
    }
  };

  return (
    <div className='bg-gradient-to-r from-[#2e1a47] to-[#624a82] container mx-auto p-6'>
      {questionList.map((item) => {
        const { question_id, question, options1, options2, options3, options4, answer, discription, image, file_type, file_url, quizname } = item;
        return (
          <div key={question_id} className='bg-white p-20 rounded-lg shadow-md mb-6'>
            <h4>{quizname}</h4>
            <h2 className='text-xl text-black font-bold mb-2'>{question_id}. {question}</h2>
            {image && (
              <img
                src={image}
                alt="question related"
                className="w-full h-auto max-w-md mb-4 border rounded shadow-md"
              />
            )}
            {file_type === 'image' && (<img src={file_url} className="w-full h-auto max-w-md mb-4 border rounded shadow-md" alt="file related to the question" />)}
            {file_type === 'audio' && <audio src={file_url} controls autoPlay />}
            {file_type === 'video' && <video width="750" height="500" controls><source src={file_url} type="video/mp4" /></video>}
            {discription && <p className='text-gray-700 mb-4'>{discription}</p>}
            <div className='mb-4'>
              {options1 && (
                <div className='mb-2'>
                  <input
                    type="radio"
                    id={`options1_${question_id}`}
                    name={`${question_id}`}
                    onChange={() => handleOptionChange(question_id, options1, answer)}
                    className='mr-2'
                  />
                  <label htmlFor={`options1_${question_id}`} className='text-gray-800'>{options1}</label>
                </div>
              )}
              {options2 && (
                <div className='mb-2'>
                  <input
                    type="radio"
                    id={`options2_${question_id}`}
                    name={`${question_id}`}
                    onChange={() => handleOptionChange(question_id, options2, answer)}
                    className='mr-2'
                  />
                  <label htmlFor={`options2_${question_id}`} className='text-gray-800'>{options2}</label>
                </div>
              )}
              {options3 && (
                <div className='mb-2'>
                  <input
                    type="radio"
                    id={`options3_${question_id}`}
                    name={`${question_id}`}
                    onChange={() => handleOptionChange(question_id, options3, answer)}
                    className='mr-2'
                  />
                  <label htmlFor={`options3_${question_id}`} className='text-gray-800'>{options3}</label>
                </div>
              )}
              {options4 && (
                <div className='mb-2'>
                  <input
                    type="radio"
                    id={`options4_${question_id}`}
                    name={`${question_id}`}
                    onChange={() => handleOptionChange(question_id, options4, answer)}
                    className='mr-2'
                  />
                  <label htmlFor={`options4_${question_id}`} className='text-gray-800'>{options4}</label>
                </div>
              )}
            </div>
            <div className='flex justify-end space-x-4'>
              <button onClick={() => handleUpdate(question_id)} className='flex items-center text-blue-500 hover:text-blue-700'>
                <FaEdit className='mr-1' /> Edit
              </button>
              <button onClick={() => handleDelete(question_id)} className='flex items-center text-red-500 hover:text-red-700'>
                <FaTrashAlt className='mr-1' /> Delete
              </button>
            </div>
          </div>
        );
      })}
      <input
        placeholder='Enter quiz name for confirmation'
        value={quiznameforconformation}
        onChange={(e) => setQuizNameForConformation(e.target.value)}
        required
        className=" px-4 py-2 mt-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        className='mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700'
        onClick={setQuizForExam}
      >
        Set Quiz for Exam
      </button>
      <button
     onClick={handleViewMarks}
     className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700" >
     View Marks
   </button>
   

    </div>
  

  );
};

export default Createquizquestion;
