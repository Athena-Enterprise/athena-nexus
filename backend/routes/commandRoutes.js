// backend/routes/commandRoutes.js

const express = require('express');
const router = express.Router();
const { Command } = require('../models'); // Ensure Command model is correctly imported
const isAdmin = require('../middleware/isAdmin');
const { body, validationResult } = require('express-validator');
const { updateAllGuildCommands } = require('../bot/utils/updateAllGuildCommands'); // Import the function
const { Server } = require('../models'); // Add this line

// Apply isAdmin middleware to all routes in this router
router.use(isAdmin);

// GET /api/commands - Fetch all commands
router.get('/', async (req, res) => {
  try {
    const commands = await Command.findAll();
    res.json(commands);
  } catch (error) {
    console.error('Error fetching commands:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/commands/:id - Update a command
router.put(
  '/:id',
  [
    body('enabled').optional().isBoolean().withMessage('Enabled must be a boolean'),
    body('status').optional().isIn(['development', 'active', 'deprecated']).withMessage('Invalid status'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { enabled, status } = req.body;

    try {
      const command = await Command.findByPk(id);
      if (!command) {
        return res.status(404).json({ error: 'Command not found' });
      }

      if (enabled !== undefined) {
        command.enabled = enabled;
      }

      if (status !== undefined) {
        command.status = status;
      }

      await command.save();

      // After saving, trigger command updates on Discord
      const { DISCORD_CLIENT_ID, BOT_TOKEN } = process.env;

      if (!DISCORD_CLIENT_ID || !BOT_TOKEN) {
        console.error('Discord Client ID or Bot Token not set in environment variables.');
        return res.status(500).json({ error: 'Discord configuration missing.' });
      }

      // Fetch all servers to get their premium status
      const servers = await Server.findAll(); // Ensure Server model is imported
      const isPremiumMap = new Map();
      servers.forEach(server => {
        isPremiumMap.set(server.id, server.premium);
      });

      await updateAllGuildCommands(DISCORD_CLIENT_ID, BOT_TOKEN, isPremiumMap);

      res.json({ message: 'Command updated and Discord commands deployed successfully', command });
    } catch (error) {
      console.error('Error updating command:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;
