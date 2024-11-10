// backend/models/index.js

const path = require('path');
const dotenv = require('dotenv');
const { Sequelize, DataTypes } = require('sequelize');
const logger = require('../utils/logger');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Sequelize with DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: (msg) => logger.info(msg), // Use your logger for Sequelize logs
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
  define: {
    freezeTableName: true, // Prevent Sequelize from pluralizing table names
    quoteIdentifiers: false, // Disable quoted identifiers
  },
});

// Import Models
const User = require('./user')(sequelize, DataTypes);
const Server = require('./server')(sequelize, DataTypes);
const ServerMember = require('./serverMember')(sequelize, DataTypes);
const ServerStats = require('./serverStats')(sequelize, DataTypes);
const Command = require('./command')(sequelize, DataTypes);
const Feature = require('./feature')(sequelize, DataTypes);
const ServerCommand = require('./serverCommand')(sequelize, DataTypes);
const ServerFeature = require('./serverFeature')(sequelize, DataTypes);
const CustomCommand = require('./customCommand')(sequelize, DataTypes);
const ActivityLog = require('./activityLog')(sequelize, DataTypes);
const Notification = require('./notification')(sequelize, DataTypes);

// Collect all models
const models = {
  User,
  Server,
  ServerMember,
  ServerStats,
  Command,
  Feature,
  ServerCommand,
  ServerFeature,
  CustomCommand,
  ActivityLog,
  Notification,
};

// Initialize associations defined in models
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

// Export Models and Sequelize Instance
module.exports = {
  sequelize,
  Sequelize, // Export Sequelize
  ...models,
};
