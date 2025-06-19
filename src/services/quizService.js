import api from './api.js'; // Assuming your central axios instance

// API_URL should be 'http://localhost:5000/api' now

export const getQuizzes = () => api.get('/quizzes');

export const createQuiz = (name) => api.post('/quizzes', { data: { name } });

// Note the change to a DELETE request and URL encoding for names with spaces/special chars
export const deleteQuiz = (name) => api.delete(`/quizzes/${encodeURIComponent(name)}`);

// Use PUT for updates. `quizData` is { quizDate, quizTime, quizDuration }
export const updateQuizTimer = (quizName, quizData) => api.put(`/quizzes/${encodeURIComponent(quizName)}/timer`, quizData);

// This is no longer needed, as navigation is a frontend concern
// The component will just navigate and then fetch questions for the new route
// export const setQuestionBankForQuiz = ...

// The component that needs questions will call this directly
export const fetchQuestions = (quizName) => api.get(`/quizzes/${encodeURIComponent(quizName)}/questions`);