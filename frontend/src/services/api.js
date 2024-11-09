// frontend/src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Correct base URL without trailing slash
  withCredentials: true, // Include cookies if using session-based auth
});

// Optional: Add interceptors for request/response
api.interceptors.request.use(
  (config) => {
    // Modify request config if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here
    return Promise.reject(error);
  }
);

export default api;
