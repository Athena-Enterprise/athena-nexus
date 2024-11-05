// backend/models/serverCommand.js

module.exports = (sequelize, DataTypes) => {
  const ServerCommand = sequelize.define('ServerCommand', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    serverId: { // Foreign key to Server
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Servers',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    commandId: { // Foreign key to Command
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Commands',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'ServerCommands',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['serverId', 'commandId'],
      },
    ],
  });

  ServerCommand.associate = (models) => {
    ServerCommand.belongsTo(models.Server, { as: 'server', foreignKey: 'serverId' });
    ServerCommand.belongsTo(models.Command, { as: 'command', foreignKey: 'commandId' });
  };

  return ServerCommand;
};
