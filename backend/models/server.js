// backend/models/server.js

module.exports = (sequelize, DataTypes) => {
  const Server = sequelize.define('Server', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    premium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tier: {
      type: DataTypes.ENUM('free', 'community', 'enterprise'),
      defaultValue: 'free',
    },
    iconUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'servers',
    timestamps: true,
  });

  Server.associate = (models) => {
    Server.belongsTo(models.User, { as: 'owner', foreignKey: 'ownerId' });
    Server.hasMany(models.ServerMember, { foreignKey: 'serverId', as: 'members' });
    Server.hasOne(models.ServerStats, { as: 'stats', foreignKey: 'ServerId' });
    Server.belongsToMany(models.Feature, { through: 'ServerFeatures', as: 'features', foreignKey: 'ServerId' });
    Server.belongsToMany(models.Command, {
      through: models.ServerCommand,
      as: 'commands',
      foreignKey: 'serverId',
      otherKey: 'commandId',
    });
    Server.hasMany(models.CustomCommand, { as: 'customCommands', foreignKey: 'serverId' });
  };

  return Server;
};
