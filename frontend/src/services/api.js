// frontend/src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend URL
  withCredentials: true, // Send cookies with requests
});

export default api;
