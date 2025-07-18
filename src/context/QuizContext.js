import React, { useContext, useReducer, useEffect } from "react";
import api from "../services/api.js";
import reducer from "../component/reducer.js";

const initialState = {
  questions: [],
  members: [],
  timer: null,
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchApiData = async (endpoint, type) => {
    try {
      const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
      const response = await api.get(`${backendUrl}${endpoint}`, { withCredentials: true });
      dispatch({
        type,
        payload: response.data,
      });
    } catch (e) {
      console.error(`Error fetching ${endpoint}:`, e);
    }
  };

  useEffect(() => {
    // Only fetch data on quiz-related pages
    const isQuizPage = window.location.pathname.includes("/quiz") || window.location.pathname.includes("/Timer");
    if (isQuizPage) {
      // fetchApiData('/quiz/getQuestion', "GET_QUESTION");
      // fetchApiData('/admine/membersDetail', "GET_MEMBERS");
      fetchApiData('/quizsetup/getSaveTimer', "GET_TIMER");
    }
  }, []);

  return <AppContext.Provider value={{ ...state }}>{children}</AppContext.Provider>;
};

const useGlobalcontext = () => useContext(AppContext);

export { AppContext, AppProvider, useGlobalcontext };