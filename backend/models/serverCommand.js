// backend/models/serverCommand.js

module.exports = (sequelize, DataTypes) => {
  const ServerCommand = sequelize.define('ServerCommand', {
    serverId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'servers',
        key: 'id',
      },
      onDelete: 'CASCADE',
      primaryKey: true,
    },
    commandId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'commands',
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
    tableName: 'servercommands',
    timestamps: true,
  });

  ServerCommand.associate = (models) => {
    ServerCommand.belongsTo(models.Server, { as: 'server', foreignKey: 'serverId' });
    ServerCommand.belongsTo(models.Command, { as: 'command', foreignKey: 'commandId' });
  };

  return ServerCommand;
};
