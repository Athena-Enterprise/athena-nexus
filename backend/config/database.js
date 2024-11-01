// backend/database.js

require('dotenv').config();
const { Sequelize } = require('sequelize');

// Check if DATABASE_URL is correctly loaded from .env
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not defined in .env');
  process.exit(1); // Exit the process if env variable isn't found
}

// Determine if the environment is development or production
const isDevelopment = process.env.NODE_ENV !== 'production';

// Connect to PostgreSQL using Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Disable logging in production
});

// Optional: Comment out the authentication logs if not needed
sequelize
  .authenticate()
  .then(() => {
    if (isDevelopment) {
      console.log('Database connection established.');
    }
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
