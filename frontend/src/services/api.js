// frontend/src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxy handles the baseURL
  withCredentials: true, // Send cookies with every request
});

export default api;
