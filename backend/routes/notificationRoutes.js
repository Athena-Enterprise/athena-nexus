// backend/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

// Import Middleware
const { isAuthenticated } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');


// Import Controller
const notificationController = require('../controllers/notificationController');

// Apply middlewares
router.use(isAuthenticated);
router.use(isAdmin);

// GET /api/admins/notifications - Fetch all notifications
router.get('/notifications', notificationController.getAllNotifications);

// POST /api/admins/notifications - Create a new notification
router.post(
  '/notifications',
  [
    body('title').notEmpty().withMessage('Title is required.'),
    body('message').notEmpty().withMessage('Message is required.'),
    body('type').isIn(['info', 'warning', 'error']).withMessage('Invalid type.'),
  ],
  notificationController.createNotification
);

// PUT /api/admins/notifications/:id - Update a notification
router.put(
  '/notifications/:id',
  [
    param('id').isInt().withMessage('Notification ID must be an integer.'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty.'),
    body('message').optional().notEmpty().withMessage('Message cannot be empty.'),
    body('type').optional().isIn(['info', 'warning', 'error']).withMessage('Invalid type.'),
    body('read').optional().isBoolean().withMessage('Read must be a boolean.'),
  ],
  notificationController.updateNotification
);

// DELETE /api/admins/notifications/:id - Delete a notification
router.delete(
  '/notifications/:id',
  [
    param('id').isInt().withMessage('Notification ID must be an integer.'),
  ],
  notificationController.deleteNotification
);

module.exports = router;
