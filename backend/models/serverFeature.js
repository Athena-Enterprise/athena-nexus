// backend/models/serverFeature.js

module.exports = (sequelize, DataTypes) => {
    const ServerFeature = sequelize.define('ServerFeature', {
      ServerId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Servers',
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      FeatureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Features',
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
      tableName: 'ServerFeatures',
      timestamps: false,
    });
  
    ServerFeature.associate = (models) => {
      // Associations are handled in Server and Feature models
    };
  
    return ServerFeature;
  };
  