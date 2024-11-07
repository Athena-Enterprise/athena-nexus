// backend/models/serverStats.js

module.exports = (sequelize, DataTypes) => {
  const ServerStats = sequelize.define('ServerStats', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ServerId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Servers',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    // Add other stats as necessary
  }, {
    tableName: 'ServerStats',
    timestamps: true,
  });

  ServerStats.associate = (models) => {
    ServerStats.belongsTo(models.Server, { foreignKey: 'ServerId' });
  };

  return ServerStats;
};
