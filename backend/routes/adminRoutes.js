// backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const isAuthenticated = require('../middleware/isAuthenticated');
const adminController = require('../controllers/adminController');

// Apply middlewares
router.use(isAuthenticated);
router.use(isAdmin);

// GET /api/admins/statistics - Fetch statistics
router.get('/statistics', adminController.getStatistics);

// GET /api/admins/servers - Fetch all servers
router.get('/servers', adminController.getAllServers);

// GET /api/admins/users - Fetch all users
router.get('/users', adminController.getAllUsers);

// POST /api/admins - Add a new admin
router.post('/', adminController.addAdmin);

// DELETE /api/admins/:discordId - Remove an admin
router.delete('/:discordId', adminController.removeAdmin);

module.exports = router;
