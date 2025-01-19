import React, { useState } from 'react';
import { IoMdAddCircle, IoMdAdd } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import Nav from './Nav.js';
import toast, { Toaster } from 'react-hot-toast';
import CreateQuizQuestion from "./createquizquestion.js";

const QuestionDemo = () => {
  const [question, setQuestion] = useState('');
  const [questionId, setQuestionID] = useState('');
  const [options, setOptions] = useState(['']);
  const [showImageInput, setShowImageInput] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [answer, setAnswer] = useState('');
  const [description, setDescription] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSection, setUploadSection] = useState(true);
  const [questions, setQuestions] = useState([]);

  const handleChange = (setter) => (e) => setter(e.target.value);
  const handleOptionChange = (index) => (e) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;
    setOptions(newOptions);
  };
  const handleAddOption = () => setOptions([...options, '']);
  const handleRemoveOption = (index) => setOptions(options.filter((_, i) => i !== index));

  const handleFinalQuestion = async () => {
    if (!questionId || !question || !answer) {
      toast.error("Please fill all inputs");
      return;
    }

    const data = { questionId, question, options, description, imgSrc, answer };
    try {
      const response = await axios.post("https://inquizitive-web.onrender.com/quizsetup/addquestion_to_quiz", { data });
      if (response.status === 200) {
        setQuestions([...questions, data]);
        resetForm();
        toast.success("Question added successfully!");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to add question!");
    }
  };

  const resetForm = () => {
    setQuestion('');
    setQuestionID('');
    setOptions(['']);
    setDescription('');
    setImgSrc('');
    setAnswer('');
    setShowImageInput(false);
    setShowDescriptionInput(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('mediaType', selectedMediaType);
    formData.append('file', selectedFile);
    formData.append('questionId', questionId);

    try {
      const response = await axios.post("https://inquizitive-web.onrender.com/quiz/uploadMediaQuestion", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.status === 200) {
        toast.success("File uploaded successfully!");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.log("Error uploading file:", error);
      toast.error("Failed to upload file!");
    }
  };

  return (
    <>
      <Nav />
      <div className="bg-gradient-to-r from-[#2e1a47] to-[#624a82] card p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Question ID</label>
            <input
              type="number"
              className="border border-gray-300 p-2 text-black rounded-md w-full"
              placeholder='only enter integer'
              value={questionId}
              onChange={handleChange(setQuestionID)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Question</label>
            <input
              type="text"
              className="border border-gray-300 p-2 text-black rounded-md w-full"
              value={question}
              onChange={handleChange(setQuestion)}
            />
          </div>

          <div className="mt-4">
            <button onClick={() => setShowImageInput(true)} className="text-blue-500 hover:underline flex items-center">
              Click here to add image <IoMdAdd className="ml-1" />
            </button>
            {showImageInput && (
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  placeholder='Enter image address'
                  value={imgSrc}
                  onChange={handleChange(setImgSrc)}
                  className="border border-gray-300 text-black p-2 rounded-md w-full"
                />
                <button onClick={() => setShowImageInput(false)} className="text-red-500">
                  <FaTrashAlt />
                </button>
              </div>
            )}
          </div>

          {uploadSection && (
            <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-8 w-full">
              <label className="block text-gray-700 font-semibold mb-2">Select Media Type</label>
              <select
                value={selectedMediaType}
                onChange={handleChange(setSelectedMediaType)}
                className="border border-gray-300 p-2 rounded-md w-full"
              >
                <option value="">-- Select --</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>

              {selectedMediaType && (
                <div className="mt-4">
                <label className="block text-gray-700 font-semibold mb-2">
        Upload {selectedMediaType}
      </label>
      <input
        type="file"
        accept={`${selectedMediaType}/*`}
        onChange={(e) => setSelectedFile(e.target.files[0])}
        className="border border-gray-300 text-black p-2 rounded-md w-full"
        name="fileUpload"
      />
                </div>
              )}

              <button
                onClick={handleUpload}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={!selectedFile}
              >
                Upload
              </button>
            </div>
          )}

          <div className="mt-4">
            <button onClick={() => setShowDescriptionInput(true)} className="text-blue-500 hover:underline flex items-center">
              Click here to add Description <IoMdAdd className="ml-1" />
            </button>
            {showDescriptionInput && (
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  value={description}
                  onChange={handleChange(setDescription)}
                  className="border border-gray-300 text-black p-2 rounded-md w-full"
                />
                <button onClick={() => setShowDescriptionInput(false)} className="text-red-500">
                  <FaTrashAlt />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Answer</label>
            <input
              type="text"
              value={answer}
              onChange={handleChange(setAnswer)}
              className="border border-gray-300 p-2 text-black rounded-md w-full"
            />
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Options</h3>
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={handleOptionChange(index)}
                  className="border border-gray-300 text-black p-2 rounded-md w-full"
                />
                <button onClick={() => handleRemoveOption(index)} className="text-red-500">
                  <FaTrashAlt />
                </button>
              </div>
            ))}
            <button onClick={handleAddOption} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
              Add Option <IoMdAddCircle className="ml-1" />
            </button>
          </div>

          <button
            onClick={handleFinalQuestion}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit Question
          </button>
        </div>
      </div>
      <Toaster position="top-center" />
      <CreateQuizQuestion />
      
    </>
  );
};

export default QuestionDemo;
