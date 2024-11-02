/* // backend/routes/customCommandRoutes.js

const express = require('express');
const router = express.Router();
const { CustomCommand, Server } = require('../models');
const { isAuthenticated } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// POST /api/customCommands - Create a new custom command
router.post(
  '/',
  isAuthenticated,
  [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('response').isString().notEmpty().withMessage('Response is required'),
    body('enabled').optional().isBoolean().withMessage('Enabled must be a boolean'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, response, enabled } = req.body;
    const serverId = req.user.serverId; // Ensure serverId is available in user context

    try {
      const server = await Server.findByPk(serverId);
      if (!server) {
        return res.status(404).json({ error: 'Server not found.' });
      }

      // Check if a custom command with the same name already exists for the server
      const existingCommand = await CustomCommand.findOne({ where: { serverId, name } });
      if (existingCommand) {
        return res.status(400).json({ error: 'Custom command with this name already exists.' });
      }

      const newCustomCommand = await CustomCommand.create({
        serverId,
        name,
        response,
        enabled: enabled !== undefined ? enabled : true,
      });

      res.status(201).json(newCustomCommand);
    } catch (error) {
      console.error('Error creating custom command:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/customCommands - Fetch all custom commands for the authenticated server
router.get('/', isAuthenticated, async (req, res) => {
  const serverId = req.user.serverId; // Ensure serverId is available in user context

  try {
    const customCommands = await CustomCommand.findAll({
      where: { serverId },
      attributes: ['id', 'name', 'response', 'enabled', 'createdAt', 'updatedAt'],
    });

    res.json(customCommands);
  } catch (error) {
    console.error('Error fetching custom commands:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/customCommands/:id - Update a custom command
router.put(
  '/:id',
  isAuthenticated,
  [
    body('name').optional().isString().withMessage('Name must be a string'),
    body('response').optional().isString().withMessage('Response must be a string'),
    body('enabled').optional().isBoolean().withMessage('Enabled must be a boolean'),
  ],
  async (req, res) => {
    const { id } = req.params;
    const { name, response, enabled } = req.body;
    const serverId = req.user.serverId; // Ensure serverId is available in user context

    try {
      const customCommand = await CustomCommand.findOne({ where: { id, serverId } });
      if (!customCommand) {
        return res.status(404).json({ error: 'Custom command not found.' });
      }

      if (name !== undefined) {
        // Check for duplicate names
        const existingCommand = await CustomCommand.findOne({ where: { serverId, name, id: { [Op.ne]: id } } });
        if (existingCommand) {
          return res.status(400).json({ error: 'Another custom command with this name already exists.' });
        }
        customCommand.name = name;
      }

      if (response !== undefined) {
        customCommand.response = response;
      }

      if (enabled !== undefined) {
        customCommand.enabled = enabled;
      }

      await customCommand.save();

      res.json(customCommand);
    } catch (error) {
      console.error('Error updating custom command:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/customCommands/:id - Delete a custom command
router.delete('/:id', isAuthenticated, async (req, res) =>
 */