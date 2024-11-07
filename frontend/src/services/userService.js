// src/services/userService.js

import api from './api';

export const fetchUserStats = async () => {
  try {
    const response = await api.get('/users/me/stats', { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};
