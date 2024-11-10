// backend/models/notification.js

module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: { // 'info', 'warning', 'error'
        type: DataTypes.ENUM('info', 'warning', 'error'),
        allowNull: false,
        defaultValue: 'info',
      },
    }, {
      tableName: 'notifications',
      timestamps: true,
    });
  
    Notification.associate = (models) => {
      // Define associations if needed, e.g., sending to specific users or servers
    };
  
    return Notification;
  };
  