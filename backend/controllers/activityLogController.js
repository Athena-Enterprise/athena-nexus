// backend/controllers/activityLogController.js

const { ActivityLog } = require('../models');
const logger = require('../utils/logger');

// Fetch all activity logs
exports.getAllActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      order: [['createdAt', 'DESC']],
      limit: 100, // Limit to recent 100 logs
    });
    res.json(logs);
    logger.info('Fetched all activity logs successfully.');
  } catch (error) {
    logger.error(`Error fetching activity logs: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new activity log (internal use)
exports.createActivityLog = async (req, res) => {
  const { action, userId, details } = req.body;

  if (!action || !userId) {
    return res.status(400).json({ error: 'Action and userId are required.' });
  }

  try {
    const log = await ActivityLog.create({
      action,
      userId,
      details: details || '',
    });

    res.status(201).json(log);
    logger.info(`Activity log created: ${action} by User ID: ${userId}`);
  } catch (error) {
    logger.error(`Error creating activity log: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
