import React, { useContext, useReducer, useEffect } from "react";
import reducer from "./reducer.js";

const initialState = {
  questions: [],
  members: [],
  timer: null
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const Api1 = "https://inquizitive-web.onrender.com/quiz/getQuestion";
  const Api2 = "https://inquizitive-web.onrender.com/admine/membersDetail";
  const Api3 = "https://inquizitive-web.onrender.com/quizsetup/getSaveTimer";

  const fetchApiData = async (url, type) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include', // This enables cookies to be sent with the request
      });
      const data = await response.json();
      //console.log("data",data)
      dispatch({
        type: type,
        payload: data
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchApiData(Api1, "GET_QUESTION");
    fetchApiData(Api2, "GET_MEMBERS");
    fetchApiData(Api3, "GET_TIMER");
  }, []);
console.log("state->",state)
  return <AppContext.Provider value={{ ...state }}>{children}</AppContext.Provider>;
};

const useGlobalcontext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider, useGlobalcontext };

// reducer.js
