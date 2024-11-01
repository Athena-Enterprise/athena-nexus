// backend/scripts/createMissingServerStats.js

const path = require('path');
const { sequelize, Server, ServerStats } = require(path.resolve(__dirname, '../models/index'));

const createMissingServerStats = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    const servers = await Server.findAll({
      include: [{ model: ServerStats, as: 'stats' }],
    });

    for (const server of servers) {
      if (!server.stats) {
        await ServerStats.create({
          ServerId: server.id,
          memberCount: server.memberCount,
          onlineMembers: server.onlineMembers,
        });
        console.log(`ServerStats created for ${server.name}.`);
      }
    }

    console.log('Missing ServerStats entries have been created.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating ServerStats:', error);
    process.exit(1);
  }
};

createMissingServerStats();
