// backend/controllers/userController.js

const { User, ServerMember, Server } = require('../models');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

// Update getUser function
exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: ServerMember,
          as: 'serverMemberships',
          include: [
            {
              model: Server,
              as: 'server',
              attributes: ['id', 'name', 'tier', 'premium', 'iconUrl'],
            },
          ],
        },
      ],
    });

    if (!user) {
      logger.warn(`User not found with ID: ${req.user.id}`);
      return res.status(404).json({ error: 'User not found.' });
    }

    const servers = user.serverMemberships.map((membership) => ({
      id: membership.server.id,
      name: membership.server.name,
      role: membership.role,
      tier: membership.server.tier,
      premium: membership.server.premium,
      iconUrl: membership.server.iconUrl,
    }));

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isPremium: user.isPremium,
      avatar: user.avatar,
      discordId: user.discordId,
      servers,
    });
    logger.info(`User data sent for user ID: ${user.id}`);
  } catch (error) {
    logger.error(`Error fetching user (ID: ${req.user.id}): ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, newsletterSubscribed } = req.body;

    const user = await User.findByPk(userId);

    if (username) {
      user.username = username;
      logger.info(`Username updated for user ID: ${user.id} to ${username}`);
    }

    if (newsletterSubscribed !== undefined) {
      user.newsletterSubscribed = newsletterSubscribed;
      logger.info(`Newsletter subscription updated for user ID: ${user.id} to ${newsletterSubscribed}`);
    }

    await user.save();

    res.json({ message: 'Settings updated successfully.', user });
  } catch (error) {
    logger.error(`Error updating user (ID: ${req.user.id}): ${error.message}`);
    res.status(500).json({ message: 'Failed to update user.' });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch total number of servers where the user is an owner
    const totalServers = await ServerMember.count({
      where: { userId, role: 'owner' },
    });

    // If you don't have `memberCount` and `activeMemberCount` fields, set defaults
    const totalMembers = 0;
    const activeMembers = 0;

    // Fetch member growth over time (use real data if available)
    const memberGrowth = []; // Empty array if no data

    // Fetch recent activity (use real data if available)
    const recentActivity = []; // Empty array if no data

    res.json({
      username: req.user.username,
      totalServers,
      totalMembers,
      activeMembers,
      memberGrowth,
      recentActivity,
    });
  } catch (error) {
    console.error(`Error fetching user stats: ${error.stack}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Admin-only functions
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      logger.warn(`User not found with ID: ${id}`);
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deleting yourself
    if (user.id === req.user.id) {
      logger.warn(`Attempt to delete self by user ID: ${req.user.id}`);
      return res.status(400).json({ error: 'Cannot delete yourself.' });
    }

    await user.destroy();
    logger.info(`User deleted successfully. ID: ${id}`);
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.promoteUser = async (req, res) => {
  const { discordId } = req.params;

  try {
    const user = await User.findOne({ where: { discordId } });
    if (!user) {
      logger.warn(`User not found with Discord ID: ${discordId}`);
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isAdmin) {
      logger.warn(`User already an admin. Discord ID: ${discordId}`);
      return res.status(400).json({ error: 'User is already an admin' });
    }

    user.isAdmin = true;
    await user.save();

    logger.info(`User promoted to admin. Discord ID: ${discordId}`);
    res.json({ message: `User ${user.username} is now an admin.` });
  } catch (error) {
    logger.error('Error promoting user to admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
