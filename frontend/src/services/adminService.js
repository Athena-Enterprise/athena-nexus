// src/services/adminService.js

import api from './api';

export const fetchAdminStats = async () => {
  try {
    const response = await api.get('/admins/statistics', { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
};
