// backend/models/serverFeature.js

module.exports = (sequelize, DataTypes) => {
  const ServerFeature = sequelize.define('ServerFeature', {
    ServerId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'servers',
        key: 'id',
      },
      onDelete: 'CASCADE',
      primaryKey: true,
    },
    FeatureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'features',
        key: 'id',
      },
      onDelete: 'CASCADE',
      primaryKey: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'serverfeatures',
    timestamps: false,
  });

  ServerFeature.associate = (models) => {
    // Associations handled in Server and Feature models
  };

  return ServerFeature;
};
