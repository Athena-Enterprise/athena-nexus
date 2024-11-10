// backend/controllers/notificationController.js

const { Notification } = require('../models');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Fetch all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [['createdAt', 'DESC']],
      limit: 100, // Recent 100 notifications
    });
    res.json(notifications);
    logger.info('Fetched all notifications successfully.');
  } catch (error) {
    logger.error(`Error fetching notifications: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new notification
exports.createNotification = async (req, res) => {
  const { title, message, type } = req.body;

  if (!title || !message || !type) {
    return res.status(400).json({ error: 'Title, message, and type are required.' });
  }

  try {
    const notification = await Notification.create({
      title,
      message,
      type,
    });

    res.status(201).json(notification);
    logger.info(`Notification created: ${title}`);
  } catch (error) {
    logger.error(`Error creating notification: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a notification
exports.updateNotification = async (req, res) => {
  const { id } = req.params;
  const { title, message, type, read } = req.body;

  try {
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    if (title) notification.title = title;
    if (message) notification.message = message;
    if (type) notification.type = type;
    if (read !== undefined) notification.read = read;

    await notification.save();

    res.json({ message: 'Notification updated successfully.', notification });
    logger.info(`Notification updated: ${notification.title}`);
  } catch (error) {
    logger.error(`Error updating notification (ID: ${id}): ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    await notification.destroy();

    res.json({ message: 'Notification deleted successfully.' });
    logger.info(`Notification deleted: ${notification.title}`);
  } catch (error) {
    logger.error(`Error deleting notification (ID: ${id}): ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
