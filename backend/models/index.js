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
const Documentation = require('./documentation')(sequelize, DataTypes);
const Feature = require('./feature')(sequelize, DataTypes);
const ServerCommand = require('./serverCommand')(sequelize, DataTypes);
const ServerFeature = require('./serverFeature')(sequelize, DataTypes);
const CustomCommand = require('./customCommand')(sequelize, DataTypes);

// Collect all models
const models = {
  User,
  Server,
  ServerStats,
  Command,
  Documentation,
  Feature,
  ServerCommand,
  ServerFeature,
  CustomCommand,
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
