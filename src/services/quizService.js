import api from "./api.js";

export const getQuizzes = async () => {
  try {
    const response = await api.get("/api/quizzes", { withCredentials: true }); // New endpoint assumption
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch quizzes");
  }
};

export const createQuiz = async (name) => {
  try {
    const response = await api.post(
      "/api/creatingquiz/setQuizNameToFile",
      { name, total_rounds: 1, has_buzzer_round: false, round_questions: {} },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create quiz");
  }
};

export const deleteQuiz = async (quizName) => {
  try {
    // FIX: Change the method to api.delete and the URL to match the backend router.
    // The quiz name is encoded and placed directly in the URL.
    await api.delete(`/api/quizzes/${encodeURIComponent(quizName)}`, {
      withCredentials: true,
    });
  } catch (error) {
    // Add better error handling to show the actual message from the backend
    const errorMessage = error.response?.data?.error || "Failed to delete quiz";
    throw new Error(errorMessage);
  }
};

export const updateQuizDetails = async (quizName, detailsData) => {
  try {
    const response = await api.put(
      `/api/quizzes/${encodeURIComponent(quizName)}`,
      detailsData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Failed to update quiz details";
    throw new Error(errorMessage);
  }
};

export const fetchQuestions = (quizName) =>
  api.get(`api/quizzes/${encodeURIComponent(quizName)}/questions`);
