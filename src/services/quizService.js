import api from "./api.js";

export const getQuizzes = async () => {
  try {
    const response = await api.get('/api/quizzes', { withCredentials: true }); // New endpoint assumption
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch quizzes');
  }
};

export const createQuiz = async (name) => {
  try {
    const response = await api.post('/api/creatingquiz/setQuizNameToFile', { name, total_rounds: 1, has_buzzer_round: false, round_questions: {} }, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create quiz');
  }
};

export const deleteQuiz = async (quizName) => {
  try {
    await api.post('/api/creatingquiz/deleteQuiz', { name: quizName }, { withCredentials: true });
  } catch (error) {
    throw new Error('Failed to delete quiz');
  }
};

export const updateQuizTimer = async (quizName, timerData) => {
  try {
    await api.post('/api/quizzes/updateTimer', { name: quizName, ...timerData }, { withCredentials: true });
  } catch (error) {
    throw new Error('Failed to update timer');
  }
};

export const fetchQuestions = (quizName) =>
  api.get(`api/quizzes/${encodeURIComponent(quizName)}/questions`);
