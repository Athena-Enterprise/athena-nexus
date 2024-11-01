// frontend/src/services/serverService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this matches your backend

// Fetch all servers
export const fetchServers = async () => {
  const response = await axios.get(`${API_BASE_URL}/servers`, { withCredentials: true });
  return response.data;
};

// Fetch server stats by id
export const fetchServerStats = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/servers/${id}/stats`, { withCredentials: true });
  return response.data;
};
