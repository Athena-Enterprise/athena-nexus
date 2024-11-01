// backend/controllers/serverController.js

const { Server } = require('../models');

exports.getAllServers = async (req, res) => {
  try {
    const servers = await Server.findAll({ where: { ownerId: req.user.id } });
    res.json(servers);
  } catch (error) {
    console.error('Error fetching servers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add other server controller functions as needed
