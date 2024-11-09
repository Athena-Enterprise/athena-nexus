// backend/controllers/serverController.js

const { Server, ServerMember, ServerStats, User } = require('../models');

exports.getAllServers = async (req, res) => {
  try {
    const memberships = await ServerMember.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Server,
          as: 'server',
          attributes: ['id', 'name', 'tier', 'premium', 'iconUrl'],
        },
      ],
    });

    const servers = memberships.map((membership) => ({
      id: membership.server.id,
      name: membership.server.name,
      role: membership.role,
      tier: membership.server.tier,
      premium: membership.server.premium,
      iconUrl: membership.server.iconUrl,
    }));

    res.json(servers);
  } catch (error) {
    console.error('Error fetching servers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getServerStats = async (req, res) => {
  const { serverId } = req.params;
  try {
    const server = await Server.findOne({
      where: { id: serverId },
      include: [{ model: ServerStats, as: 'stats' }],
    });

    if (!server) {
      return res.status(404).json({ message: 'Server not found.' });
    }

    res.json(server.stats);
  } catch (error) {
    console.error('Error fetching server stats:', error);
    res.status(500).json({ message: 'Failed to fetch server stats.', error: error.message });
  }
};

exports.updateServerStats = async (req, res) => {
  const { serverId } = req.params;
  const { memberCount, onlineMembers } = req.body;

  try {
    const server = await Server.findOne({ where: { id: serverId } });
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    let stats = await ServerStats.findOne({ where: { ServerId: server.id } });
    if (!stats) {
      stats = await ServerStats.create({ ServerId: server.id });
    }

    if (memberCount !== undefined) stats.memberCount = memberCount;
    if (onlineMembers !== undefined) stats.onlineMembers = onlineMembers;
    await stats.save();

    res.json({ message: 'Server stats updated successfully.', stats });
  } catch (error) {
    console.error('Error updating server stats:', error);
    res.status(500).json({ message: 'Failed to update server stats.', error: error.message });
  }
};

exports.getServerUsers = async (req, res) => {
  const { serverId } = req.params;
  try {
    const members = await ServerMember.findAll({
      where: { serverId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatar'],
        },
      ],
    });

    const users = members.map((member) => ({
      id: member.user.id,
      username: member.user.username,
      avatar: member.user.avatar,
      role: member.role,
    }));

    res.json(users);
  } catch (error) {
    console.error('Error fetching server users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateMemberRole = async (req, res) => {
  const { serverId, userId } = req.params;
  const { role } = req.body;

  // Validate role
  const validRoles = ['owner', 'admin', 'moderator', 'member'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    // Check if the member exists
    const member = await ServerMember.findOne({ where: { serverId, userId } });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Only allow owners to promote/demote others
    if (req.user.id !== req.membership.userId || req.membership.role !== 'owner') {
      return res.status(403).json({ error: 'Forbidden: Only the server owner can update member roles.' });
    }

    // Prevent changing the owner's role
    if (member.role === 'owner') {
      return res.status(400).json({ error: 'Cannot change the role of the server owner.' });
    }

    // Update the member's role
    await member.update({ role });
    res.json({ message: 'Member role updated successfully', member });
  } catch (error) {
    console.error('Error updating member role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
