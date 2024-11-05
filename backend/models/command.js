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
      unique: true, // Ensure command names are unique
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
    tier: {
      type: DataTypes.ENUM('free', 'community', 'enterprise'),
      defaultValue: 'free',
    },
    featureId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Now NOT NULL after migration
      references: {
        model: 'Features',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  }, {
    tableName: 'Commands',
    timestamps: true,
  });

  Command.associate = (models) => {
    Command.belongsTo(models.Feature, { foreignKey: 'featureId', as: 'feature' });
    Command.hasMany(models.ServerCommand, { foreignKey: 'commandId', as: 'serverCommands' });

    // Define belongsToMany association
    Command.belongsToMany(models.Server, {
      through: models.ServerCommand,
      as: 'servers',
      foreignKey: 'commandId',
      otherKey: 'serverId',
    });
  };

  return Command;
};