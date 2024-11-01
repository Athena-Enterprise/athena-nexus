// backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { User } = require('../models'); // Adjust the path as necessary
const isAdmin = require('../middleware/isAdmin'); // Middleware to check admin privileges
const { body, validationResult } = require('express-validator');
const adminController = require('../controllers/adminController');

// Apply isAdmin middleware to all routes in this router
router.use(isAdmin);

// GET /api/admins - Fetch all admins
router.get('/', async (req, res) => {
  try {
    const admins = await User.findAll({
      where: { isAdmin: true },
      attributes: ['id', 'username', 'discriminator', 'discordId', 'avatar', 'isAdmin'],
    });
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admins - Add a new admin
router.post(
  '/',
  [
    body('discordId').isString().isLength({ min: 17, max: 19 }).withMessage('Invalid Discord ID'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { discordId } = req.body;

    try {
      const user = await User.findOne({ where: { discordId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.isAdmin) {
        return res.status(400).json({ error: 'User is already an admin' });
      }

      user.isAdmin = true;
      await user.save();

      res.json({ message: `User ${user.username}#${user.discriminator} is now an admin.` });
    } catch (error) {
      console.error('Error adding admin:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/admins/:discordId - Remove an admin
router.delete('/:discordId', async (req, res) => {
  const { discordId } = req.params;

  try {
    const user = await User.findOne({ where: { discordId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isAdmin) {
      return res.status(400).json({ error: 'User is not an admin' });
    }

    // Prevent removing yourself (assuming your discordId is stored)
    if (user.discordId === req.user.discordId) {
      return res.status(400).json({ error: 'Cannot remove yourself as an admin' });
    }

    user.isAdmin = false;
    await user.save();

    res.json({ message: `User ${user.username}#${user.discriminator} is no longer an admin.` });
  } catch (error) {
    console.error('Error removing admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/statistics - Fetch statistics
router.get('/statistics', adminController.getStatistics);


module.exports = router;
