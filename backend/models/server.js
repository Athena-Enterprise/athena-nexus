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
    ownerId: { // Foreign key referencing User
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users', // Ensure the Users table is correctly named
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    // Define other associations if necessary
  };

  return Server;
};
