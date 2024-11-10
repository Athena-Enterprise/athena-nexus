// backend/routes/activityLogRoutes.js

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Import Middleware
const { isAuthenticated } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Import Controller
const activityLogController = require('../controllers/activityLogController');

// Apply middlewares
router.use(isAuthenticated);
router.use(isAdmin);

// GET /api/admins/activity-logs - Fetch all activity logs
router.get('/activity-logs', activityLogController.getAllActivityLogs);

// POST /api/admins/activity-logs - Create a new activity log
router.post(
  '/activity-logs',
  [
    body('action').notEmpty().withMessage('Action is required.'),
    body('userId').isInt().withMessage('User ID must be an integer.'),
    body('details').optional().isString(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation errors: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  activityLogController.createActivityLog
);

module.exports = router;
