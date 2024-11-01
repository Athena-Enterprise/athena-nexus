// frontend/src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // This ensures cookies are sent
});

export default api;
