// backend/models/serverStats.js

module.exports = (sequelize, DataTypes) => {
  const ServerStats = sequelize.define('ServerStats', {
    ServerId: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: 'servers',
        key: 'id',
      },
    },
    memberCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    onlineMembers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    messageCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Add other statistics fields as needed
  }, {
    tableName: 'serverstats',
    timestamps: true,
  });

  ServerStats.associate = (models) => {
    ServerStats.belongsTo(models.Server, { foreignKey: 'ServerId', as: 'server' });
  };

  return ServerStats;
};
