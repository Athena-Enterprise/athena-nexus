// backend/services/statsService.js

const { User, Server, ServerMember, sequelize, Sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const osu = require('node-os-utils');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

// Utility function to format uptime
const formatUptime = (seconds) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  return `${d}d ${h}h ${m}m ${s}s`;
};

const fetchAdminStats = async () => {
  try {
    const totalUsers = await User.count();
    const totalServers = await Server.count();
    const premiumUsers = await User.count({ where: { isPremium: true } });
    const freeUsers = totalUsers - premiumUsers;

    // Define Active Servers (Servers with at least one member)
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
    if (!process.env.DB_NAME) {
      throw new Error('DB_NAME environment variable is not defined.');
    }

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

    const stats = {
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
    };

    return stats;

  } catch (error) {
    logger.error(`Error fetching admin statistics: ${error.stack || error.message}`);
    throw error;
  }
};

module.exports = { fetchAdminStats };
