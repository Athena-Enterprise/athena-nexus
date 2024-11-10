// backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Import middleware correctly
const { isAuthenticated } = require('../middleware/auth'); // Only import from auth.js
const isAdmin = require('../middleware/isAdmin'); // Import isAdmin from its own file

// Apply authentication and admin middleware to all admin routes
router.use(isAuthenticated);
router.use(isAdmin);

/**
 * Admin Management Routes
 */

// Add Admin
router.post('/add', adminController.addAdmin);

// Remove Admin
router.delete('/remove/:adminId', adminController.removeAdmin);

/**
 * Command Management Routes
 */

// Fetch Admin Commands
router.get('/commands', adminController.fetchAdminCommands);

// Create Admin Command
router.post('/commands', adminController.createAdminCommand);

// Update Admin Command
router.put('/commands/:commandId', adminController.updateAdminCommand);

// Delete Admin Command
router.delete('/commands/:commandId', adminController.deleteAdminCommand);

/**
 * Feature Management Routes
 */

// Fetch Admin Features
router.get('/features', adminController.fetchAdminFeatures);

// Create Admin Feature
router.post('/features', adminController.createAdminFeature);

// Update Admin Feature
router.put('/features/:featureId', adminController.updateAdminFeature);

// Delete Admin Feature
router.delete('/features/:featureId', adminController.deleteAdminFeature);

/**
 * Statistics Routes
 */

// Fetch Admin Statistics
router.get('/statistics', adminController.fetchAdminStats);

// Fetch All Users
router.get('/users', adminController.fetchAllUsers);

/**
 * Bot Management Routes
 */

// Fetch Bot Status
router.get('/bot/status', adminController.fetchBotStatus);

// Fetch Bot Details
router.get('/bot/details', adminController.fetchBotDetails);

// Restart Bot
router.post('/bot/restart', adminController.restartBot);

// Stop Bot
router.post('/bot/stop', adminController.stopBot);

// Update Bot Details
router.put('/bot/details', adminController.updateBotDetails);

/**
 * Activity Log Management Routes
 */

// Fetch Activity Logs
router.get('/activity-logs', adminController.fetchActivityLogs);

// Create Activity Log
router.post('/activity-logs', adminController.createActivityLog);

// Update Activity Log
router.put('/activity-logs/:logId', adminController.updateActivityLog);

// Delete Activity Log
router.delete('/activity-logs/:logId', adminController.deleteActivityLog);

/**
 * Custom Command Management Routes
 */

// Fetch Custom Commands
router.get('/custom-commands', adminController.fetchCustomCommands);

// Create Custom Command
router.post('/custom-commands', adminController.createCustomCommand);

// Update Custom Command
router.put('/custom-commands/:commandId', adminController.updateCustomCommand);

// Delete Custom Command
router.delete('/custom-commands/:commandId', adminController.deleteCustomCommand);

/**
 * Notification Management Routes
 */

// Fetch Notifications
router.get('/notifications', adminController.fetchNotifications);

// Create Notification
router.post('/notifications', adminController.createNotification);

// Update Notification
router.put('/notifications/:notificationId', adminController.updateNotification);

// Delete Notification
router.delete('/notifications/:notificationId', adminController.deleteNotification);

module.exports = router;
