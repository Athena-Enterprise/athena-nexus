// backend/routes/commandRoutes.js

const express = require('express');
const router = express.Router();
const { Command, Server, ServerCommand, Feature } = require('../models'); // Ensure all necessary models are imported
const isAdmin = require('../middleware/isAdmin');
const { body, validationResult } = require('express-validator');
const { updateAllGuildCommands } = require('../utils/updateAllGuildCommands'); // Import the function
const { isAuthenticated } = require('../middleware/auth');
const deployCommands = require('../utils/deployCommands'); // Correct import


// Apply isAdmin middleware to all routes in this router
router.use(isAdmin);

// GET /api/commands - Fetch all global commands
router.get('/', async (req, res) => {
  try {
    const commands = await Command.findAll({
      include: [{
        model: Feature,
        as: 'feature',
        attributes: ['id', 'name'],
      }],
    });
    res.json(commands);
  } catch (error) {
    console.error('Error fetching commands:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/commands/:id - Update a global command
router.put(
  '/:id',
  [
    body('enabled').optional().isBoolean().withMessage('Enabled must be a boolean'),
    body('status').optional().isIn(['development', 'active', 'deprecated']).withMessage('Invalid status'),
    body('tier').optional().isIn(['free', 'community', 'enterprise']).withMessage('Invalid tier'),
    body('premiumOnly').optional().isBoolean().withMessage('premiumOnly must be a boolean'),
    body('featureId').optional().isInt().withMessage('featureId must be an integer'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { enabled, status, tier, premiumOnly, featureId } = req.body;

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

      if (tier !== undefined) {
        command.tier = tier;
      }

      if (premiumOnly !== undefined) {
        command.premiumOnly = premiumOnly;
      }

      if (featureId !== undefined) {
        const feature = await Feature.findByPk(featureId);
        if (!feature) {
          return res.status(400).json({ error: 'Invalid featureId' });
        }
        command.featureId = featureId;
      }

      await command.save();

      // After saving, trigger command updates on Discord for all guilds
      const { DISCORD_CLIENT_ID, BOT_TOKEN } = process.env;

      if (!DISCORD_CLIENT_ID || !BOT_TOKEN) {
        console.error('Discord Client ID or Bot Token not set in environment variables.');
        return res.status(500).json({ error: 'Discord configuration missing.' });
      }

      // Fetch all servers to get their premium status
      const servers = await Server.findAll();
      const isPremiumMap = new Map();
      servers.forEach(server => {
        isPremiumMap.set(server.id, server.premium);
      });

      // Deploy commands for each guild
      for (const [guildId, isPremium] of isPremiumMap.entries()) {
        await deployCommands(DISCORD_CLIENT_ID, guildId, BOT_TOKEN, isPremium);
      }

      res.json({ message: 'Command updated and Discord commands deployed successfully', command });
    } catch (error) {
      console.error('Error updating command:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/commands/enabled - Fetch commands enabled for the authenticated server
router.get('/enabled', isAuthenticated, async (req, res) => {
  try {
    const serverId = req.user.serverId; // Ensure you have serverId in user context
    if (!serverId) {
      return res.status(400).json({ error: 'Server ID not associated with the user.' });
    }

    // Fetch all global commands
    const globalCommands = await Command.findAll({
      include: [{
        model: Feature,
        as: 'feature',
        attributes: ['id', 'name', 'status'],
      }],
    });

    // Fetch server-specific command settings
    const serverCommands = await ServerCommand.findAll({
      where: { serverId },
      attributes: ['commandId', 'enabled'],
    });

    const serverCommandMap = new Map();
    serverCommands.forEach(sc => {
      serverCommandMap.set(sc.commandId, sc.enabled);
    });

    // Determine effective command status
    const effectiveCommands = globalCommands.map(cmd => {
      // Check global status
      if (cmd.status !== 'active') {
        return { id: cmd.id, name: cmd.name, description: cmd.description, enabled: false, status: cmd.status };
      }

      // Check if feature is active
      if (cmd.feature.status !== 'active') {
        return { id: cmd.id, name: cmd.name, description: cmd.description, enabled: false, status: cmd.feature.status };
      }

      // Check server-specific enabled status
      const serverEnabled = serverCommandMap.has(cmd.id) ? serverCommandMap.get(cmd.id) : cmd.enabled;

      // Determine if the command should be enabled
      return { id: cmd.id, name: cmd.name, description: cmd.description, enabled: serverEnabled, status: cmd.status };
    });

    res.json(effectiveCommands);
  } catch (error) {
    console.error('Error fetching commands:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
