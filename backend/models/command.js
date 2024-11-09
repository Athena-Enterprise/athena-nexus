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
      unique: true,
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
      allowNull: true,
      references: {
        model: 'features',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  }, {
    tableName: 'commands',
    timestamps: true,
  });

  Command.associate = (models) => {
    Command.belongsTo(models.Feature, { foreignKey: 'featureId', as: 'feature' });
    Command.belongsToMany(models.Server, {
      through: models.ServerCommand,
      as: 'servers',
      foreignKey: 'commandId',
      otherKey: 'serverId',
    });
  };

  return Command;
};
