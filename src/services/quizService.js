import api from "./api.js";

export const getQuizzes = () => api.get("api/quizzes");

export const createQuiz = (name) => api.post("api/quizzes", { data: { name } });

export const deleteQuiz = (name) =>
  api.delete(`api/quizzes/${encodeURIComponent(name)}`);

export const updateQuizTimer = (quizName, quizData) =>
  api.put(`api/quizzes/${encodeURIComponent(quizName)}/timer`, quizData);

export const fetchQuestions = (quizName) =>
  api.get(`api/quizzes/${encodeURIComponent(quizName)}/questions`);
