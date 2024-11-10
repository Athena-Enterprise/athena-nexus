// backend/models/activityLog.js

module.exports = (sequelize, DataTypes) => {
    const ActivityLog = sequelize.define('ActivityLog', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    }, {
      tableName: 'activitylogs',
      timestamps: true,
    });
  
    ActivityLog.associate = (models) => {
      ActivityLog.belongsTo(models.User, { foreignKey: 'userId', as: 'User' });
    };
  
    return ActivityLog;
  };
  