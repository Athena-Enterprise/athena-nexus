// frontend/src/services/adminService.js

import api from './api';

// ----- Admin Management -----

// Add Admin
export const addAdmin = (adminData) => api.post('/admins/add', adminData);

// Remove Admin
export const removeAdmin = (adminId) => api.delete(`/admins/remove/${adminId}`);

// ----- Command Management -----

// Fetch Admin Commands
export const fetchAdminCommands = () => api.get('/admins/commands');

// Create Admin Command
export const createAdminCommand = (commandData) => api.post('/admins/commands', commandData);

// Update Admin Command
export const updateAdminCommand = (commandId, updatedData) =>
  api.put(`/admins/commands/${commandId}`, updatedData);

// Delete Admin Command
export const deleteAdminCommand = (commandId) =>
  api.delete(`/admins/commands/${commandId}`);

// ----- Feature Management -----

// Fetch Admin Features
export const fetchAdminFeatures = () => api.get('/admins/features');

// Create Admin Feature
export const createAdminFeature = (featureData) => api.post('/admins/features', featureData);

// Update Admin Feature
export const updateAdminFeature = (featureId, updatedData) =>
  api.put(`/admins/features/${featureId}`, updatedData);

// Delete Admin Feature
export const deleteAdminFeature = (featureId) =>
  api.delete(`/admins/features/${featureId}`);

// ----- Statistics -----

// Fetch Admin Statistics
export const fetchAdminStats = () => api.get('/admins/statistics');

// Fetch All Users
export const fetchAllUsers = () => api.get('/admins/users');

// ----- Bot Management -----

// Fetch Bot Status
export const fetchBotStatus = () => api.get('/admins/bot/status');

// Fetch Bot Details
export const fetchBotDetails = () => api.get('/admins/bot/details');

// Restart Bot
export const restartBot = () => api.post('/admins/bot/restart');

// Stop Bot
export const stopBot = () => api.post('/admins/bot/stop');

// Update Bot Details
export const updateBotDetails = (botData) => api.put('/admins/bot/details', botData);

// ----- Activity Log Management -----

// Fetch Activity Logs
export const fetchActivityLogs = () => api.get('/admins/activity-logs');

// Create Activity Log
export const createActivityLog = (logData) => api.post('/admins/activity-logs', logData);

// Update Activity Log
export const updateActivityLog = (logId, updatedData) =>
  api.put(`/admins/activity-logs/${logId}`, updatedData);

// Delete Activity Log
export const deleteActivityLog = (logId) => api.delete(`/admins/activity-logs/${logId}`);

// ----- Custom Command Management -----

// Fetch Custom Commands
export const fetchCustomCommands = () => api.get('/admins/custom-commands');

// Create Custom Command
export const createCustomCommand = (commandData) =>
  api.post('/admins/custom-commands', commandData);

// Update Custom Command
export const updateCustomCommand = (commandId, updatedData) =>
  api.put(`/admins/custom-commands/${commandId}`, updatedData);

// Delete Custom Command
export const deleteCustomCommand = (commandId) =>
  api.delete(`/admins/custom-commands/${commandId}`);
  
// ----- Notification Management -----

// Fetch Notifications
export const fetchNotifications = () => api.get('/admins/notifications');

// Create Notification
export const createNotification = (notificationData) =>
  api.post('/admins/notifications', notificationData);

// Update Notification
export const updateNotification = (notificationId, updatedData) =>
  api.put(`/admins/notifications/${notificationId}`, updatedData);

// Delete Notification
export const deleteNotification = (notificationId) =>
  api.delete(`/admins/notifications/${notificationId}`);
