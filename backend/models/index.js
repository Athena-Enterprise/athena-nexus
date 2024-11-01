// backend/models/index.js

const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Sequelize with DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // Set to console.log to see SQL queries
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
});

// Import Models
const User = require('./user')(sequelize, DataTypes);
const Server = require('./server')(sequelize, DataTypes);
const ServerStats = require('./serverStats')(sequelize, DataTypes);
const Command = require('./command')(sequelize, DataTypes);

// Define Associations
User.hasMany(Server, { as: 'servers', foreignKey: 'ownerId' });
Server.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

Server.hasOne(ServerStats, { as: 'stats', foreignKey: 'ServerId' });
ServerStats.belongsTo(Server, { foreignKey: 'ServerId' });

Server.hasMany(Command, { as: 'commands', foreignKey: 'ServerId' });
Command.belongsTo(Server, { foreignKey: 'ServerId' });

// Export Models and Sequelize Instance
module.exports = {
  sequelize,
  Sequelize, // Export Sequelize
  User,
  Server,
  ServerStats,
  Command,
};
