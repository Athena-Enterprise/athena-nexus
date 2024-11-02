// backend/controllers/adminController.js

const { User, Server } = require('../models'); // Ensure Server is imported

exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.findAll({ where: { isAdmin: true } });
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addAdmin = async (req, res) => {
  const { discordId } = req.body;

  try {
    const user = await User.findOne({ where: { id: discordId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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
    const user = await User.findOne({ where: { id: discordId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isAdmin = false;
    await user.save();

    res.json({ message: `User ${user.username}#${user.discriminator} is no longer an admin.` });
  } catch (error) {
    console.error('Error removing admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalServers = await Server.count();
    const premiumUsers = await User.count({ where: { isPremium: true } });
    const freeUsers = totalUsers - premiumUsers;

    // You can add more statistics as needed, such as active commands, total commands, etc.

    res.json({
      totalUsers,
      totalServers,
      premiumUsers,
      freeUsers,
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