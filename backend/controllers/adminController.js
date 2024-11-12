// backend/controllers/adminController.js

const { User, Command, Feature, CustomCommand, ActivityLog, Notification, Server, ServerMember, sequelize } = require('../models');
const { Op, Sequelize } = require('sequelize');
const logger = require('../utils/logger');
const osu = require('node-os-utils'); // Import node-os-utils
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

/**
 * Admin Management Controllers
 */

// Add Admin
exports.addAdmin = async (req, res) => {
  const { discordId } = req.body;

  try {
    const user = await User.findOne({ where: { discordId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.isAdmin) {
      return res.status(400).json({ error: 'User is already an admin.' });
    }

    user.isAdmin = true;
    await user.save();

    res.json({ message: 'User promoted to admin successfully.' });
    logger.info(`User ${user.username} promoted to admin by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error adding admin: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Remove Admin
exports.removeAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    const admin = await User.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found.' });
    }

    if (!admin.isAdmin) {
      return res.status(400).json({ error: 'User is not an admin.' });
    }

    // Prevent removing self as admin
    if (admin.id === req.user.id) {
      return res.status(400).json({ error: 'You cannot remove your own admin status.' });
    }

    admin.isAdmin = false;
    await admin.save();

    res.json({ message: 'Admin removed successfully.' });
    logger.info(`Admin ${admin.username} demoted by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error removing admin: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Command Management Controllers
 */

// Fetch Admin Commands
exports.fetchAdminCommands = async (req, res) => {
  try {
    const commands = await Command.findAll({
      include: [{ model: Feature, as: 'feature' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(commands);
  } catch (error) {
    logger.error(`Error fetching admin commands: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create Admin Command
exports.createAdminCommand = async (req, res) => {
  const { name, description, action, selector, tier, featureId, enabled } = req.body;

  try {
    // Validate required fields
    if (!name || !action || !selector) {
      return res.status(400).json({ error: 'Name, action, and selector are required.' });
    }

    // Check if command name already exists
    const existingCommand = await Command.findOne({ where: { name } });
    if (existingCommand) {
      return res.status(400).json({ error: 'Command name already exists.' });
    }

    // Create new command
    const newCommand = await Command.create({
      name,
      description,
      action,
      selector,
      tier,
      featureId,
      enabled,
    });

    res.status(201).json(newCommand);
    logger.info(`Command "${name}" created by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error creating admin command: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update Admin Command
exports.updateAdminCommand = async (req, res) => {
  const { commandId } = req.params;
  const { name, description, action, selector, tier, featureId, enabled } = req.body;

  try {
    const command = await Command.findByPk(commandId);
    if (!command) {
      return res.status(404).json({ error: 'Command not found.' });
    }

    // Update fields if provided
    if (name) command.name = name;
    if (description) command.description = description;
    if (selector) command.selector = selector;
    if (tier) command.tier = tier;
    if (featureId !== undefined) command.featureId = featureId;
    if (enabled !== undefined) command.enabled = enabled;
    if (action) command.action = action;

    await command.save();

    // Write command to file
    const fs = require('fs');
    const path = require('path');

    const commandsDir = path.join(__dirname, '../bot/commands');
    const commandFilePath = path.join(commandsDir, `${command.name}.js`);

    const commandFileContent = `
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('${command.name}')
    .setDescription('${command.description}'),
  async execute(interaction) {
    ${command.action}
  },
};
`;

    fs.writeFileSync(commandFilePath, commandFileContent);

    // Optionally, restart the bot to apply changes
    // await exports.restartBot(req, res);

    res.json({ message: 'Command updated successfully.', command });
    logger.info(`Command "${command.name}" updated by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error updating admin command: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete Admin Command
exports.deleteAdminCommand = async (req, res) => {
  const { commandId } = req.params;

  try {
    const command = await Command.findByPk(commandId);
    if (!command) {
      return res.status(404).json({ error: 'Command not found.' });
    }

    await command.destroy();

    res.json({ message: 'Command deleted successfully.' });
    logger.info(`Command "${command.name}" deleted by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error deleting admin command: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Feature Management Controllers
 */

// Fetch Admin Features
exports.fetchAdminFeatures = async (req, res) => {
  try {
    const features = await Feature.findAll({
      include: [{ model: Command, as: 'commands' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(features);
  } catch (error) {
    logger.error(`Error fetching admin features: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create Admin Feature
exports.createAdminFeature = async (req, res) => {
  const { name, description, premiumOnly, enabled, status, tier } = req.body;

  try {
    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Feature name is required.' });
    }

    // Check if feature name already exists
    const existingFeature = await Feature.findOne({ where: { name } });
    if (existingFeature) {
      return res.status(400).json({ error: 'Feature name already exists.' });
    }

    // Create new feature
    const newFeature = await Feature.create({
      name,
      description,
      premiumOnly,
      enabled,
      status,
      tier,
    });

    res.status(201).json(newFeature);
    logger.info(`Feature "${name}" created by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error creating admin feature: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update Admin Feature
exports.updateAdminFeature = async (req, res) => {
  const { featureId } = req.params;
  const { name, description, premiumOnly, enabled, status, tier } = req.body;

  try {
    const feature = await Feature.findByPk(featureId);
    if (!feature) {
      return res.status(404).json({ error: 'Feature not found.' });
    }

    // Update fields if provided
    if (name) feature.name = name;
    if (description) feature.description = description;
    if (premiumOnly !== undefined) feature.premiumOnly = premiumOnly;
    if (enabled !== undefined) feature.enabled = enabled;
    if (status) feature.status = status;
    if (tier) feature.tier = tier;

    await feature.save();

    res.json(feature);
    logger.info(`Feature "${feature.name}" updated by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error updating admin feature: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete Admin Feature
exports.deleteAdminFeature = async (req, res) => {
  const { featureId } = req.params;

  try {
    const feature = await Feature.findByPk(featureId);
    if (!feature) {
      return res.status(404).json({ error: 'Feature not found.' });
    }

    // Optionally, check if any commands are associated with this feature
    const associatedCommands = await Command.findAll({ where: { featureId } });
    if (associatedCommands.length > 0) {
      return res.status(400).json({ error: 'Cannot delete feature with associated commands.' });
    }

    await feature.destroy();

    res.json({ message: 'Feature deleted successfully.' });
    logger.info(`Feature "${feature.name}" deleted by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error deleting admin feature: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Statistics Controllers
 */

// Fetch Admin Statistics
exports.fetchAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalServers = await Server.count();
    const premiumUsers = await User.count({ where: { isPremium: true } });
    const freeUsers = totalUsers - premiumUsers;

    // Define Active Servers (Example: Servers with at least one member)
    const activeServers = await Server.count({
      include: [{
        model: ServerMember,
        as: 'members', // Ensure this alias matches your association
        required: true, // Only count servers with at least one member
      }],
    });

    // System Metrics
    const cpuUsage = await cpu.usage(); // Returns a percentage
    const memoryInfo = await mem.info(); // Returns an object with memory details
    const memoryUsage = `${memoryInfo.usedMemMb} MB used / ${memoryInfo.totalMemMb} MB total`;
    
    // Database Size (Assuming PostgreSQL)
    const databaseSizeResult = await sequelize.query(
      `SELECT pg_size_pretty(pg_database_size('${process.env.DB_NAME}')) AS size;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const databaseSize = databaseSizeResult[0].size;

    // Uptime
    const uptimeSeconds = os.uptime(); // Returns uptime in seconds
    const uptime = formatUptime(uptimeSeconds);

    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // User registrations over the past 30 days
    const userRegistrations = await User.findAll({
      attributes: [
        [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('createdAt')), 'registration_day'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'users'],
      ],
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
      group: ['registration_day'],
      order: [['registration_day', 'ASC']],
      raw: true,
    });

    // Recent signups
    const recentSignups = await User.findAll({
      attributes: ['id', 'username', 'discriminator', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 10,
      raw: true,
    });

    res.json({
      totalUsers,
      totalServers,
      activeServers,
      premiumUsers,
      freeUsers,
      systemMetrics: {
        cpuUsage: `${cpuUsage}%`,
        memoryUsage,
        databaseSize,
        uptime,
      },
      userRegistrations,
      recentSignups,
    });
    logger.info(`Admin statistics fetched by ${req.user.username}.`);

    // Emit the updated stats to all connected admin clients
    const io = req.app.get('io');
    io.emit('adminStatsUpdate', {
      totalUsers,
      totalServers,
      activeServers,
      premiumUsers,
      freeUsers,
      systemMetrics: {
        cpuUsage: `${cpuUsage}%`,
        memoryUsage,
        databaseSize,
        uptime,
      },
      userRegistrations,
      recentSignups,
    });

  } catch (error) {
    logger.error(`Error fetching admin statistics: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Utility function to format uptime
const formatUptime = (seconds) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  return `${d}d ${h}h ${m}m ${s}s`;
};

// Fetch All Users
exports.fetchAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'discordId', 'username', 'discriminator', 'email', 'isAdmin', 'isPremium', 'status'],
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    logger.error(`Error fetching all users: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Bot Management Controllers
 */

// Fetch Bot Status
exports.fetchBotStatus = async (req, res) => {
  try {
    const cpuUsage = await osu.cpu.usage();
    const memoryInfo = await osu.mem.info();
    const memoryUsage = `${memoryInfo.usedMemMb} MB used`;
    const databaseSizeResult = await sequelize.query(
      `SELECT pg_size_pretty(pg_database_size('${process.env.DB_NAME}')) AS size;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const databaseSize = databaseSizeResult[0].size;
    const uptimeSeconds = process.uptime();
    const uptime = formatUptime(uptimeSeconds);

    const status = {
      cpuUsage: `${cpuUsage}%`,
      memoryUsage,
      databaseSize,
      uptime,
    };

    res.json(status);
  } catch (error) {
    logger.error(`Error fetching bot status: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch Bot Details
exports.fetchBotDetails = async (req, res) => {
  try {
    // Assuming bot details are stored in a config or fetched from Discord API
    // For demonstration, using environment variables or a config file
    const details = {
      name: process.env.BOT_NAME || 'Athena Nexus Bot',
      description: process.env.BOT_DESCRIPTION || 'Your friendly neighborhood bot.',
      avatarUrl: process.env.BOT_AVATAR_URL || 'https://example.com/avatar.png',
      disableAddingToServers: process.env.DISABLE_ADDING_TO_SERVERS === 'true',
    };
    res.json(details);
  } catch (error) {
    logger.error(`Error fetching bot details: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Restart Bot
exports.restartBot = async (req, res) => {
  try {
    // Implement actual bot restart logic
    // This might involve sending a signal to the process manager (PM2, systemd, etc.)
    // Example using PM2:
    const pm2 = require('pm2');

    pm2.connect((err) => {
      if (err) {
        logger.error(`Error connecting to PM2: ${err.stack || err}`);
        res.status(500).json({ error: 'Failed to connect to PM2.' });
        return;
      }

      pm2.restart(process.env.BOT_PM2_NAME || 'athena-bot', (err) => {
        pm2.disconnect();
        if (err) {
          logger.error(`Error restarting bot: ${err.stack || err}`);
          res.status(500).json({ error: 'Failed to restart bot.' });
          return;
        }
        res.json({ message: 'Bot restart initiated successfully.' });
        logger.info(`Bot restarted by ${req.user.username}.`);
      });
    });
  } catch (error) {
    logger.error(`Error restarting bot: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Stop Bot
exports.stopBot = async (req, res) => {
  try {
    // Implement actual bot stop logic
    // This might involve sending a signal to the process manager (PM2, systemd, etc.)
    // Example using PM2:
    const pm2 = require('pm2');

    pm2.connect((err) => {
      if (err) {
        logger.error(`Error connecting to PM2: ${err.stack || err}`);
        res.status(500).json({ error: 'Failed to connect to PM2.' });
        return;
      }

      pm2.stop(process.env.BOT_PM2_NAME || 'athena-bot', (err) => {
        pm2.disconnect();
        if (err) {
          logger.error(`Error stopping bot: ${err.stack || err}`);
          res.status(500).json({ error: 'Failed to stop bot.' });
          return;
        }
        res.json({ message: 'Bot stop initiated successfully.' });
        logger.info(`Bot stopped by ${req.user.username}.`);
      });
    });
  } catch (error) {
    logger.error(`Error stopping bot: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update Bot Details
exports.updateBotDetails = async (req, res) => {
  const { name, description, avatarUrl, disableAddingToServers } = req.body;

  try {
    // Update bot details in configuration or database
    // This example assumes bot details are stored in environment variables or a config file

    // For demonstration, using a simple approach:
    // Ideally, you should store these in a database or configuration service

    // Example: Update a JSON config file
    const fs = require('fs');
    const path = require('path');

    const configPath = path.join(__dirname, '../config/botConfig.json');
    let config = {};

    if (fs.existsSync(configPath)) {
      const configFile = fs.readFileSync(configPath);
      config = JSON.parse(configFile);
    }

    if (name) config.name = name;
    if (description) config.description = description;
    if (avatarUrl) config.avatarUrl = avatarUrl;
    if (disableAddingToServers !== undefined) config.disableAddingToServers = disableAddingToServers;

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    // Optionally, restart the bot to apply changes
    // await exports.restartBot(req, res);

    res.json({ message: 'Bot details updated successfully.', config });
    logger.info(`Bot details updated by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error updating bot details: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Utility function to format uptime
const formatUptime = (seconds) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  return `${d}d ${h}h ${m}m ${s}s`;
};

/**
 * Activity Log Management Controllers
 */

// Fetch Activity Logs
exports.fetchActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      include: [{ model: User, as: 'User', attributes: ['username', 'discriminator'] }],
      order: [['createdAt', 'DESC']],
      limit: 100, // Limit to recent 100 logs
    });
    res.json(logs);
  } catch (error) {
    logger.error(`Error fetching activity logs: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create Activity Log
exports.createActivityLog = async (req, res) => {
  const { action, details } = req.body;

  try {
    if (!action) {
      return res.status(400).json({ error: 'Action is required.' });
    }

    const newLog = await ActivityLog.create({
      action,
      details,
      userId: req.user.id, // Assuming the admin performing the action is logged in
    });

    res.status(201).json(newLog);
    logger.info(`Activity log created: ${action} by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error creating activity log: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update Activity Log
exports.updateActivityLog = async (req, res) => {
  const { logId } = req.params;
  const { action, details } = req.body;

  try {
    const log = await ActivityLog.findByPk(logId);
    if (!log) {
      return res.status(404).json({ error: 'Activity log not found.' });
    }

    if (action) log.action = action;
    if (details) log.details = details;

    await log.save();

    res.json(log);
    logger.info(`Activity log updated: ${action} by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error updating activity log: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete Activity Log
exports.deleteActivityLog = async (req, res) => {
  const { logId } = req.params;

  try {
    const log = await ActivityLog.findByPk(logId);
    if (!log) {
      return res.status(404).json({ error: 'Activity log not found.' });
    }

    await log.destroy();

    res.json({ message: 'Activity log deleted successfully.' });
    logger.info(`Activity log deleted: ${log.action} by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error deleting activity log: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Custom Command Management Controllers
 */

// Fetch Custom Commands
exports.fetchCustomCommands = async (req, res) => {
  try {
    const commands = await CustomCommand.findAll({
      include: [{ model: Feature, as: 'feature' }, { model: Server, as: 'server' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(commands);
  } catch (error) {
    logger.error(`Error fetching custom commands: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create Custom Command
exports.createCustomCommand = async (req, res) => {
  const { name, description, action, selector, tier, featureId, enabled, serverId } = req.body;

  try {
    // Validate required fields
    if (!name || !action || !selector || !serverId) {
      return res.status(400).json({ error: 'Name, action, selector, and serverId are required.' });
    }

    // Check if command name already exists for the server
    const existingCommand = await CustomCommand.findOne({ where: { name, serverId } });
    if (existingCommand) {
      return res.status(400).json({ error: 'Command name already exists for this server.' });
    }

    // Create new custom command
    const newCustomCommand = await CustomCommand.create({
      name,
      description,
      action,
      selector,
      tier,
      featureId,
      enabled,
      serverId,
    });

    res.status(201).json(newCustomCommand);
    logger.info(`Custom command "${name}" created for server ${serverId} by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error creating custom command: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update Custom Command
exports.updateCustomCommand = async (req, res) => {
  const { commandId } = req.params;
  const { name, description, action, selector, tier, featureId, enabled } = req.body;

  try {
    const command = await CustomCommand.findByPk(commandId);
    if (!command) {
      return res.status(404).json({ error: 'Custom command not found.' });
    }

    // Update fields if provided
    if (name) command.name = name;
    if (description) command.description = description;
    if (action) command.action = action;
    if (selector) command.selector = selector;
    if (tier) command.tier = tier;
    if (featureId !== undefined) command.featureId = featureId;
    if (enabled !== undefined) command.enabled = enabled;

    await command.save();

    res.json(command);
    logger.info(`Custom command "${command.name}" updated by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error updating custom command: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete Custom Command
exports.deleteCustomCommand = async (req, res) => {
  const { commandId } = req.params;

  try {
    const command = await CustomCommand.findByPk(commandId);
    if (!command) {
      return res.status(404).json({ error: 'Custom command not found.' });
    }

    await command.destroy();

    res.json({ message: 'Custom command deleted successfully.' });
    logger.info(`Custom command "${command.name}" deleted by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error deleting custom command: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Notification Management Controllers
 */

// Fetch Notifications
exports.fetchNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(notifications);
  } catch (error) {
    logger.error(`Error fetching notifications: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create Notification
exports.createNotification = async (req, res) => {
  const { title, message, type } = req.body;

  try {
    // Validate required fields
    if (!title || !message || !type) {
      return res.status(400).json({ error: 'Title, message, and type are required.' });
    }

    // Create new notification
    const newNotification = await Notification.create({
      title,
      message,
      type,
    });

    res.status(201).json(newNotification);
    logger.info(`Notification "${title}" created by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error creating notification: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update Notification
exports.updateNotification = async (req, res) => {
  const { notificationId } = req.params;
  const { title, message, type } = req.body;

  try {
    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    // Update fields if provided
    if (title) notification.title = title;
    if (message) notification.message = message;
    if (type) notification.type = type;

    await notification.save();

    res.json(notification);
    logger.info(`Notification "${notification.title}" updated by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error updating notification: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete Notification
exports.deleteNotification = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    await notification.destroy();

    res.json({ message: 'Notification deleted successfully.' });
    logger.info(`Notification "${notification.title}" deleted by ${req.user.username}.`);
  } catch (error) {
    logger.error(`Error deleting notification: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
