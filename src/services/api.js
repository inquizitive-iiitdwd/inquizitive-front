// src/services/api.js
import axios from 'axios';

// The backend URL now includes the `/api` base path for our new routes
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export default api;