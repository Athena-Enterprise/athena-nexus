// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { User } = require('../models');
const isAdmin = require('../middleware/isAdmin');
const { param, validationResult } = require('express-validator');
const isAuthenticated = require('../middleware/isAuthenticated'); // Middleware to check authentication

// Apply isAdmin middleware to admin-specific routes
router.use(isAdmin);

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a user by ID
router.delete(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid User ID'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Prevent deleting yourself
      if (user.discordId === req.user.discordId) {
        return res.status(400).json({ error: 'Cannot delete yourself.' });
      }

      await user.destroy();
      res.json({ message: 'User deleted successfully.' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Promote a user to admin by Discord ID
router.post(
  '/:discordId/promote',
  [
    param('discordId').isString().isLength({ min: 17, max: 19 }).withMessage('Invalid Discord ID'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { discordId } = req.params;

    try {
      const user = await User.findOne({ where: { discordId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.isAdmin = true;
      await user.save();

      res.json({ message: `User ${user.username}#${user.discriminator} is now an admin.` });
    } catch (error) {
      console.error('Error promoting user to admin:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Apply isAuthenticated middleware to protect routes
router.use(isAuthenticated);

// Import userController
const userController = require('../controllers/userController');

// GET /api/users/me - Fetch the authenticated user's data
router.get('/me', userController.getUser);

module.exports = router;
