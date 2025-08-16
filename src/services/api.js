// src/services/api.js
import axios from "axios";

// The backend URL now includes the `/api` base path for our new routes
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // Ensure cookies are sent with requests
});

export default api;
