// backend/models/user.js

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING, // Primary key, unique identifier
      primaryKey: true,
      allowNull: false,
    },
    discordId: {
      type: DataTypes.STRING, // Discord User ID as string
      unique: true,
      allowNull: true, // Allows unlinking
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
      allowNull: true, // Made nullable to prevent notNull Violation
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },  
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    newsletterSubscribed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isAdmin: { // Added isAdmin field
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'Users',
    timestamps: true,
  });

  User.associate = (models) => {
    User.hasMany(models.Server, { foreignKey: 'ownerId', as: 'ownedServers' });
    User.hasMany(models.Documentation, { as: 'documents', foreignKey: 'authorId' }); // Added association
    // Define other associations if necessary
  };

  // Hash password before saving user
  User.beforeCreate(async (user, options) => {
    if (user.passwordHash) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
    }
  });

  // Also handle password updates
  User.beforeUpdate(async (user, options) => {
    if (user.changed('passwordHash') && user.passwordHash) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
    }
  });

  return User;
};
