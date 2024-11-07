// backend/models/user.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.STRING,
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
      discriminator: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null if Discord doesn't provide email
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
    },
    {
      tableName: 'Users',
      timestamps: true,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Server, { foreignKey: 'ownerId', as: 'ownedServers' });
  };

  return User;
};
