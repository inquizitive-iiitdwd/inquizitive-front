import React, { useState } from 'react';
import { FaUpload, FaLink, FaArrowLeft, FaPlus } from 'react-icons/fa';

const initialFormState = {
  questionId: '',
  question: '',
  questionType: 'single-correct',
  options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
  answer: '',
  description: '',
  imgSrc: '',
  marks: 1,
  negativeMarks: 0,
  skipMarks: 0,
};

const QuizFormModal = ({ onQuestionSubmit, quizname, onBack }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaSource, setMediaSource] = useState('none');
  const [isLoading, setIsLoading] = useState(false);

  const questionTypes = [
    'single-correct',
    'multiple-correct',
    'fill-in-the-blank',
    'audio',
    'video',
    'image',
    'true-false',
    'matching',
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'select-multiple') {
      // For multiple-correct, store array of selected answers
      const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
      setFormData((prev) => ({ ...prev, [name]: selected }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { text: '', isCorrect: false }],
    }));
  };

  const removeOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0] || null);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedFile(null);
    setMediaSource('none');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.questionId || !formData.question || (!formData.answer && formData.questionType !== 'matching')) {
      alert('Please fill in Question ID, Question, and Answer.');
      setIsLoading(false);
      return;
    }

    if (
      ['single-correct', 'multiple-correct', 'audio', 'video', 'image'].includes(formData.questionType) &&
      formData.options.every((opt) => !opt.text)
    ) {
      alert('Please provide at least one option for this question type.');
      setIsLoading(false);
      return;
    }

    const submissionData = new FormData();
    submissionData.append('questionId', formData.questionId);
    submissionData.append('question', formData.question);
    submissionData.append('questionType', formData.questionType);
    submissionData.append('answer', JSON.stringify(formData.answer));
    submissionData.append('description', formData.description);
    submissionData.append('quizname', quizname);
    submissionData.append('marks', formData.marks);
    submissionData.append('negativeMarks', formData.negativeMarks);
    submissionData.append('skipMarks', formData.skipMarks);
    formData.options.forEach((opt, i) => {
      submissionData.append(`options${i + 1}`, JSON.stringify(opt));
    });
    if (mediaSource === 'upload' && selectedFile) {
      submissionData.append('file', selectedFile);
    } else if (mediaSource === 'url' && formData.imgSrc) {
      submissionData.append('image', formData.imgSrc);
    }

    const success = await onQuestionSubmit(submissionData);
    if (success) {
      resetForm();
    }
    setIsLoading(false);
  };

  const renderAnswerField = () => {
    switch (formData.questionType) {
      case 'single-correct':
      case 'multiple-correct':
      case 'audio':
      case 'video':
      case 'image':
        return (
          <select
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
            required
            multiple={formData.questionType === 'multiple-correct'}
          >
            <option value="" disabled>
              Select {formData.questionType === 'multiple-correct' ? 'answers' : 'answer'}
            </option>
            {formData.options.map((opt, i) => opt.text && (
              <option key={i} value={opt.text}>{`Option ${i + 1}: ${opt.text}`}</option>
            ))}
          </select>
        );
      case 'true-false':
        return (
          <select
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
            required
          >
            <option value="" disabled>Select answer</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      case 'fill-in-the-blank':
        return (
          <input
            type="text"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            placeholder="Enter the exact answer"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        );
      case 'matching':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700">Answer Pairs (JSON)</label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              placeholder='Enter as [{"left": "A", "right": "1"}, {"left": "B", "right": "2"}]'
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows="4"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-white hover:text-yellow-400"
      >
        <FaArrowLeft /> Back to Quiz Manager
      </button>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-2xl p-6 md:p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">Add Question for {quizname}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <fieldset className="space-y-4">
            <legend className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2 mb-4">
              Question Details
            </legend>
            <div>
              <label htmlFor="questionId" className="block text-sm font-medium text-gray-700">
                Question ID (Unique Integer)
              </label>
              <input
                type="number"
                name="questionId"
                value={formData.questionId}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                Question Text
              </label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="questionType" className="block text-sm font-medium text-gray-700">
                Question Type
              </label>
              <select
                name="questionType"
                value={formData.questionType}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
              >
                {questionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace('-', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>
          <fieldset className="space-y-4">
            <legend className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2 mb-4">
              Answer & Options
            </legend>
            {(formData.questionType === 'single-correct' ||
              formData.questionType === 'multiple-correct' ||
              formData.questionType === 'audio' ||
              formData.questionType === 'video' ||
              formData.questionType === 'image' ||
              formData.questionType === 'matching') && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Options</label>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {(formData.questionType === 'single-correct' ||
                      formData.questionType === 'multiple-correct' ||
                      formData.questionType === 'audio' ||
                      formData.questionType === 'video' ||
                      formData.questionType === 'image') && (
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                >
                  <FaPlus /> Add Option
                </button>
              </div>
            )}
            {formData.questionType === 'true-false' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Options</label>
                {[{ text: 'True' }, { text: 'False' }].map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option.text}
                      disabled
                      className="block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                    />
                  </div>
                ))}
              </div>
            )}
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
                Correct Answer
              </label>
              {renderAnswerField()}
            </div>
          </fieldset>
        </div>
        <fieldset className="pt-6 border-t border-gray-200">
          <legend className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2 mb-4">
            Additional Details (Optional)
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Media</label>
              <div className="flex space-x-4">
                {['none', 'url', 'upload'].map((source) => (
                  <button
                    type="button"
                    key={source}
                    onClick={() => setMediaSource(source)}
                    className={`px-3 py-2 text-sm rounded-md flex items-center gap-2 transition-all ${
                      mediaSource === source ? 'bg-purple-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {source === 'none' && 'None'}
                    {source === 'url' && <><FaLink /> URL</>}
                    {source === 'upload' && <><FaUpload /> Upload</>}
                  </button>
                ))}
              </div>
              {mediaSource === 'url' && (
                <input
                  type="text"
                  name="imgSrc"
                  placeholder="Enter image, audio, or video URL"
                  value={formData.imgSrc}
                  onChange={handleChange}
                  className="mt-2 block w-full border border-gray-300 rounded-md p-2"
                />
              )}
              {mediaSource === 'upload' && (
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*,audio/*"
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              )}
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Answer Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain why the answer is correct"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="marks" className="block text-sm font-medium text-gray-700">
                Marks for Correct Answer
              </label>
              <select
                name="marks"
                value={formData.marks}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={5}>5</option>
              </select>
            </div>
            <div>
              <label htmlFor="negativeMarks" className="block text-sm font-medium text-gray-700">
                Negative Marks for Incorrect Answer
              </label>
              <select
                name="negativeMarks"
                value={formData.negativeMarks}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
              >
                <option value={0}>0</option>
                <option value={-1}>-1</option>
                <option value={-2}>-2</option>
              </select>
            </div>
            <div>
              <label htmlFor="skipMarks" className="block text-sm font-medium text-gray-700">
                Marks for Skipped Question
              </label>
              <select
                name="skipMarks"
                value={formData.skipMarks}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
              >
                <option value={0}>0</option>
                <option value={-1}>-1</option>
                <option value={-2}>-2</option>
              </select>
            </div>
          </div>
        </fieldset>
        <div className="flex justify-end pt-4 gap-4">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Submitting...' : 'Submit Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizFormModal;