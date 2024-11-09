// backend/middleware/hasRole.js

const { ServerMember } = require('../models');
const logger = require('../utils/logger');

const hasRole = (roles) => {
  return async (req, res, next) => {
    const { serverId } = req.params;
    const userId = req.user.id;

    try {
      const member = await ServerMember.findOne({
        where: { serverId, userId },
      });

      if (!member || !roles.includes(member.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      next();
    } catch (error) {
      console.error('Error checking user role:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

module.exports = hasRole;
