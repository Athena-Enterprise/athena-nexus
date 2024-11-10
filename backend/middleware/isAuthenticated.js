// backend/middleware/auth.js

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  logger.warn('Unauthorized access attempt.');
  return res.status(401).json({ error: 'Unauthorized' });
};

const hasRole = (roles) => {
  return async (req, res, next) => {
    const { serverId } = req.params;
    const userId = req.user.id;

    try {
      const membership = await ServerMember.findOne({
        where: { serverId, userId },
        include: [{ model: Server, as: 'server' }],
      });

      if (!membership || !roles.includes(membership.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Attach the membership and server to req for later use
      req.membership = membership;
      req.server = membership.server;

      next();
    } catch (error) {
      console.error('Error checking user role:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

module.exports = {
  isAuthenticated,
  hasRole,
};
