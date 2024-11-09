// frontend/src/services/adminService.js

import api from './api';

// ----- Commands -----
export const fetchAdminCommands = () => api.get('/admin/commands');
export const createAdminCommand = (commandData) => api.post('/admin/commands', commandData);
export const updateAdminCommand = (id, commandData) => api.put(`/admin/commands/${id}`, commandData);
export const deleteAdminCommand = (id) => api.delete(`/admin/commands/${id}`);

// ----- Features -----
export const fetchAdminFeatures = () => api.get('/admin/features');
export const createAdminFeature = (featureData) => api.post('/admin/features', featureData);
export const updateAdminFeature = (id, featureData) => api.put(`/admin/features/${id}`, featureData);
export const deleteAdminFeature = (id) => api.delete(`/admin/features/${id}`);

// ----- Bot Management -----
export const fetchBotStatus = () => api.get('/admin/bot/status');
export const fetchBotDetails = () => api.get('/admin/bot/details');
export const restartBot = () => api.post('/admin/bot/restart');
export const stopBot = () => api.post('/admin/bot/stop');
export const updateBotDetails = (details) => api.put('/admin/bot/details', details);

// ----- Stats -----
export const fetchAdminStats = () => api.get('/admin/stats');

// ----- User Management -----
export const fetchAllUsers = () => api.get('/admin/users');
export const addAdmin = (userId) => api.post(`/admin/users/${userId}/add-admin`);
export const removeAdmin = (userId) => api.post(`/admin/users/${userId}/remove-admin`);
