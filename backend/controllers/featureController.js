// backend/controllers/featureController.js

const { Feature } = require('../models');
const logger = require('../utils/logger');

// Get all features
exports.getAllFeatures = async (req, res) => {
  try {
    const features = await Feature.findAll();
    res.json(features);
    logger.info('Fetched all features successfully.');
  } catch (error) {
    logger.error(`Error fetching features: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new feature
exports.createFeature = async (req, res) => {
  const { name, description, status, enabled } = req.body;

  try {
    // Check if feature with the same name exists
    const existingFeature = await Feature.findOne({ where: { name } });
    if (existingFeature) {
      logger.warn(`Feature creation failed: Feature with name "${name}" already exists.`);
      return res.status(400).json({ error: 'Feature with this name already exists.' });
    }

    const feature = await Feature.create({
      name,
      description,
      status: status || 'active',
      enabled: enabled !== undefined ? enabled : true,
    });

    res.status(201).json({ message: 'Feature created successfully.', feature });
    logger.info(`Feature created: ${feature.name} (ID: ${feature.id})`);
  } catch (error) {
    logger.error(`Error creating feature: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a feature
exports.updateFeature = async (req, res) => {
  const { id } = req.params;
  const { name, description, status, enabled } = req.body;

  try {
    const feature = await Feature.findByPk(id);
    if (!feature) {
      logger.warn(`Feature not found with ID: ${id}`);
      return res.status(404).json({ error: 'Feature not found.' });
    }

    // Update fields if provided
    if (name !== undefined) feature.name = name;
    if (description !== undefined) feature.description = description;
    if (status !== undefined) feature.status = status;
    if (enabled !== undefined) feature.enabled = enabled;

    await feature.save();

    res.json({ message: 'Feature updated successfully.', feature });
    logger.info(`Feature updated: ${feature.name} (ID: ${feature.id})`);
  } catch (error) {
    logger.error(`Error updating feature (ID: ${id}): ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a feature
exports.deleteFeature = async (req, res) => {
  const { id } = req.params;

  try {
    const feature = await Feature.findByPk(id, {
      include: ['commands', 'customCommands'],
    });
    if (!feature) {
      logger.warn(`Feature not found with ID: ${id}`);
      return res.status(404).json({ error: 'Feature not found.' });
    }

    if (feature.commands.length > 0 || feature.customCommands.length > 0) {
      return res.status(400).json({ error: 'Cannot delete feature with associated commands.' });
    }

    await feature.destroy();

    res.json({ message: 'Feature deleted successfully.' });
    logger.info(`Feature deleted: ${feature.name} (ID: ${feature.id})`);
  } catch (error) {
    logger.error(`Error deleting feature (ID: ${id}): ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
