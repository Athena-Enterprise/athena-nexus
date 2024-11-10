// backend/controllers/customCommandController.js

const { CustomCommand, Feature } = require('../models');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Create a new custom command
exports.createCustomCommand = async (req, res) => {
  const { name, description, code, featureId } = req.body;

  if (!name || !description || !code || !featureId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Check if command already exists
    const existingCommand = await CustomCommand.findOne({ where: { name } });
    if (existingCommand) {
      return res.status(400).json({ error: 'Command with this name already exists.' });
    }

    // Ensure feature exists and is active
    const feature = await Feature.findByPk(featureId);
    if (!feature || feature.status !== 'active' || !feature.enabled) {
      return res.status(400).json({ error: 'Associated feature is inactive or disabled.' });
    }

    // Create the command
    const newCommand = await CustomCommand.create({
      name,
      description,
      code,
      featureId,
      enabled: true,
    });

    res.status(201).json({ message: 'Custom command created successfully.', command: newCommand });
    logger.info(`Custom command created: ${newCommand.name} (ID: ${newCommand.id})`);
  } catch (error) {
    logger.error(`Error creating custom command: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch all custom commands
exports.getAllCustomCommands = async (req, res) => {
  try {
    const commands = await CustomCommand.findAll({
      include: [{
        model: Feature,
        as: 'feature',
        attributes: ['id', 'name', 'status', 'enabled'],
      }],
    });

    res.json(commands);
    logger.info('Fetched all custom commands successfully.');
  } catch (error) {
    logger.error(`Error fetching custom commands: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a custom command
exports.updateCustomCommand = async (req, res) => {
  const { id } = req.params;
  const { name, description, code, featureId, enabled } = req.body;

  try {
    const command = await CustomCommand.findByPk(id);
    if (!command) {
      return res.status(404).json({ error: 'Custom command not found.' });
    }

    // Update fields if provided
    if (name) command.name = name;
    if (description) command.description = description;
    if (code) command.code = code;
    if (featureId) {
      const feature = await Feature.findByPk(featureId);
      if (!feature || feature.status !== 'active' || !feature.enabled) {
        return res.status(400).json({ error: 'Associated feature is inactive or disabled.' });
      }
      command.featureId = featureId;
    }
    if (enabled !== undefined) command.enabled = enabled;

    await command.save();

    res.json({ message: 'Custom command updated successfully.', command });
    logger.info(`Custom command updated: ${command.name} (ID: ${command.id})`);
  } catch (error) {
    logger.error(`Error updating custom command (ID: ${id}): ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a custom command
exports.deleteCustomCommand = async (req, res) => {
  const { id } = req.params;

  try {
    const command = await CustomCommand.findByPk(id);
    if (!command) {
      return res.status(404).json({ error: 'Custom command not found.' });
    }

    await command.destroy();

    res.json({ message: 'Custom command deleted successfully.' });
    logger.info(`Custom command deleted: ${command.name} (ID: ${command.id})`);
  } catch (error) {
    logger.error(`Error deleting custom command (ID: ${id}): ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
