// backend/models/documentation.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Documentation = sequelize.define('Documentation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT, // Removed 'long' as PostgreSQL doesn't support TEXT with options
      allowNull: false,
    },
    authorId: {
      type: DataTypes.STRING, // Changed from UUID to STRING
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    tableName: 'Documentation',
    timestamps: true,
  });

  Documentation.associate = (models) => {
    Documentation.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
  };

  return Documentation;
};
