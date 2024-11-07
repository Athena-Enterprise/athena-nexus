// src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Your backend API URL
  withCredentials: true, // Include cookies in requests
});

export default api;
