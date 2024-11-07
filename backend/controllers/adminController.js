// backend/controllers/adminController.js

const { User, Server, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalServers = await Server.count();
    const premiumUsers = await User.count({ where: { isPremium: true } });
    const freeUsers = totalUsers - premiumUsers;

    // User registrations over the past 30 days
    const userRegistrations = await User.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'users'],
      ],
      where: {
        createdAt: {
          [Op.gte]: sequelize.literal(`NOW() - INTERVAL '30 DAY'`),
        },
      },
      group: ['date'],
      order: [['date', 'ASC']],
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
      premiumUsers,
      freeUsers,
      userRegistrations,
      recentSignups,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
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

    res.json({ message: `User ${user.username}#${user.discriminator} is now an admin.` });
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

    res.json({ message: `User ${user.username}#${user.discriminator} is no longer an admin.` });
  } catch (error) {
    console.error('Error removing admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
