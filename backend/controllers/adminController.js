// backend/controllers/adminController.js

const { User, Server, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

exports.getStatistics = async (req, res) => {
  try {
    logger.info('Starting to fetch statistics.');

    const totalUsers = await User.count();
    logger.info(`Total Users: ${totalUsers}`);

    const totalServers = await Server.count();
    logger.info(`Total Servers: ${totalServers}`);

    const premiumUsers = await User.count({ where: { isPremium: true } });
    logger.info(`Premium Users: ${premiumUsers}`);

    const freeUsers = totalUsers - premiumUsers;
    logger.info(`Free Users: ${freeUsers}`);

    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    logger.info(`Fetching user registrations since: ${thirtyDaysAgo.toISOString()}`);

    // User registrations over the past 30 days using DATE_TRUNC
    const userRegistrations = await User.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'day', sequelize.col('createdAt')), 'registration_day'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'users'],
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
    logger.info(`User Registrations: ${JSON.stringify(userRegistrations)}`);

    // Recent signups
    logger.info('Fetching recent signups.');
    const recentSignups = await User.findAll({
      attributes: ['id', 'username', 'discriminator', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 10,
      raw: true,
    });
    logger.info(`Recent Signups: ${JSON.stringify(recentSignups)}`);

    res.json({
      totalUsers,
      totalServers,
      premiumUsers,
      freeUsers,
      userRegistrations,
      recentSignups,
    });

    logger.info('Statistics fetched successfully.');
  } catch (error) {
    logger.error(`Error fetching statistics: ${error.stack || error.message}`);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

exports.getAllServers = async (req, res) => {
  try {
    const servers = await Server.findAll({
      include: [
        { model: User, as: 'owner', attributes: ['id', 'username'] },
        // Include other associations if necessary
      ],
    });
    res.json(servers);
  } catch (error) {
    console.error('Error fetching servers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'isAdmin', 'isPremium', 'createdAt'],
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.addAdmin = async (req, res) => {
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

    res.json({ message: `User ${user.username} is now an admin.` });
  } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.removeAdmin = async (req, res) => {
  const { discordId } = req.params;

  try {
    const user = await User.findOne({ where: { discordId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isAdmin) {
      return res.status(400).json({ error: 'User is not an admin' });
    }

    // Prevent removing yourself
    if (user.discordId === req.user.discordId) {
      return res.status(400).json({ error: 'Cannot remove yourself as an admin' });
    }

    user.isAdmin = false;
    await user.save();

    res.json({ message: `User ${user.username} is no longer an admin.` });
  } catch (error) {
    console.error('Error removing admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
