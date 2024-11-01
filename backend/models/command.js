// backend/models/command.js

module.exports = (sequelize, DataTypes) => {
  const Command = sequelize.define('Command', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    premiumOnly: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    status: {
      type: DataTypes.ENUM('development', 'active', 'deprecated'),
      defaultValue: 'development',
    },
    // Add other command-related fields as necessary
  }, {
    tableName: 'Commands',
    timestamps: true,
  });

  Command.associate = (models) => {
    Command.belongsTo(models.Server, { foreignKey: 'ServerId' });
  };

  return Command;
};
