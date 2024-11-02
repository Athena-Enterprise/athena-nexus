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
    memberCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    onlineMembers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    iconUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Add other server fields as necessary
  }, {
    tableName: 'Servers',
    timestamps: true,
  });

  Server.associate = (models) => {
    Server.belongsTo(models.User, { as: 'owner', foreignKey: 'ownerId' });
    Server.hasOne(models.ServerStats, { as: 'stats', foreignKey: 'ServerId' });
    Server.hasMany(models.Command, { as: 'commands', foreignKey: 'ServerId' });
    Server.belongsToMany(models.Feature, { through: 'ServerFeatures', as: 'features', foreignKey: 'ServerId' });
    Server.hasMany(models.ServerCommand, { foreignKey: 'serverId', as: 'serverCommands' });
    // Define other associations if necessary
  };

  return Server;
};
