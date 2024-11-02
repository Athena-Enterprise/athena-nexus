// backend/models/feature.js

module.exports = (sequelize, DataTypes) => {
  const Feature = sequelize.define('Feature', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure feature names are unique
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    premiumOnly: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    status: {
      type: DataTypes.ENUM('development', 'active', 'deprecated'),
      defaultValue: 'development',
    },
    tier: {
      type: DataTypes.ENUM('free', 'community', 'enterprise'),
      defaultValue: 'free',
    },
  }, {
    tableName: 'Features',
    timestamps: true,
  });

  Feature.associate = (models) => {
    Feature.hasMany(models.Command, { foreignKey: 'featureId', as: 'commands' });
  };

  return Feature;
};
