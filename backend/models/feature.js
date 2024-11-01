const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Feature = sequelize.define('Feature', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  premium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Feature;
