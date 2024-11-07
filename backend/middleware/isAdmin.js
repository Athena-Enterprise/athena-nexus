// backend/middleware/isAdmin.js

module.exports = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ error: 'Forbidden: Admins only' });
};
