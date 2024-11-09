// backend/models/user.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    discordId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discriminator: { // Add this field
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    newsletterSubscribed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('free', 'community', 'enterprise'),
      defaultValue: 'free',
    },
  }, {
    tableName: 'users',
    timestamps: true, // Automatically adds createdAt and updatedAt
  });

  User.associate = (models) => {
    User.hasMany(models.ServerMember, { foreignKey: 'userId', as: 'serverMemberships' });
    User.hasMany(models.Server, { foreignKey: 'ownerId', as: 'ownedServers' });
  };

  return User;
};
