// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const { isAuthenticated } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const userController = require('../controllers/userController');

// Apply isAuthenticated middleware to all routes
router.use(isAuthenticated);

// GET /api/users/me - Fetch the authenticated user's data
router.get('/me', userController.getUser);

// PUT /api/users/me - Update the authenticated user's data
router.put('/me', userController.updateUser);

// GET /api/users/me/stats - Fetch the authenticated user's statistics
router.get('/me/stats', userController.getUserStats);

// Apply isAdmin middleware to admin-specific routes
router.use(isAdmin);

// GET /api/users - Get all users (admin only)
router.get('/', userController.getAllUsers);

// DELETE /api/users/:id - Delete a user by ID (admin only)
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid User ID')],
  userController.deleteUser
);

// POST /api/users/:discordId/promote - Promote a user to admin by Discord ID (admin only)
router.post(
  '/:discordId/promote',
  [param('discordId').isString().isLength({ min: 17, max: 19 }).withMessage('Invalid Discord ID')],
  userController.promoteUser
);

module.exports = router;
