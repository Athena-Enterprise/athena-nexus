// backend/models/serverMember.js

module.exports = (sequelize, DataTypes) => {
    const ServerMember = sequelize.define('ServerMember', {
      serverId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'servers',
          key: 'id',
        },
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        primaryKey: true,
      },
      role: {
        type: DataTypes.ENUM('owner', 'admin', 'moderator', 'member'),
        defaultValue: 'member',
      },
    }, {
      tableName: 'servermembers',
      timestamps: true,
    });
  
    ServerMember.associate = (models) => {
      ServerMember.belongsTo(models.Server, { foreignKey: 'serverId', as: 'server' });
      ServerMember.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };
  
    return ServerMember;
  };
  