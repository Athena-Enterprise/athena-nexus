// backend/models/server.js

module.exports = (sequelize, DataTypes) => {
  const Server = sequelize.define('Server', {
    id: {
      type: DataTypes.STRING, // Discord Server ID as string
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.STRING, // Foreign key referencing User
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
    tableName: 'Servers',
    timestamps: true,
  });

  Server.associate = (models) => {
    Server.belongsTo(models.User, { as: 'owner', foreignKey: 'ownerId' });
    Server.hasOne(models.ServerStats, { as: 'stats', foreignKey: 'ServerId' });
    Server.belongsToMany(models.Feature, { through: 'ServerFeatures', as: 'features', foreignKey: 'ServerId' });
    Server.hasMany(models.ServerCommand, { foreignKey: 'serverId', as: 'serverCommands' });
    Server.belongsToMany(models.Command, {
      through: models.ServerCommand,
      as: 'commands',
      foreignKey: 'serverId',
      otherKey: 'commandId',
    });
  };

  return Server;
};
