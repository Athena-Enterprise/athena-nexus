// backend/models/serverStats.js

module.exports = (sequelize, DataTypes) => {
  const ServerStats = sequelize.define('ServerStats', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ServerId: { // Foreign key referencing Server
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Servers',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    // Add other server stats fields as necessary
    memberCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // etc.
  }, {
    tableName: 'ServerStats',
    timestamps: true,
  });

  ServerStats.associate = (models) => {
    ServerStats.belongsTo(models.Server, { foreignKey: 'ServerId' });
  };

  return ServerStats;
};
