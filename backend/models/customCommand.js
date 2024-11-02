// backend/models/customCommand.js

module.exports = (sequelize, DataTypes) => {
    const CustomCommand = sequelize.define('CustomCommand', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      response: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    }, {
      tableName: 'CustomCommands',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['serverId', 'name'],
        },
      ],
    });
  
    CustomCommand.associate = (models) => {
      CustomCommand.belongsTo(models.Server, { as: 'server', foreignKey: 'serverId' });
    };
  
    return CustomCommand;
  };
  