// backend/models/customCommand.js

module.exports = (sequelize, DataTypes) => {
  const CustomCommand = sequelize.define('CustomCommand', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: { // New Field
      type: DataTypes.ENUM('Assign Role', 'Remove Role', 'Send Embed'),
      allowNull: false,
    },
    selector: { // New Field
      type: DataTypes.ENUM('Select User', 'Select Channel', 'Select Role'),
      allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    serverId: { // Association to Server
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'servers',
        key: 'id',
      },
    },
    featureId: { // New Association to Feature
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'features',
        key: 'id',
      },
    },
  }, {
    tableName: 'customcommands',
    timestamps: true,
  });

  CustomCommand.associate = (models) => {
    CustomCommand.belongsTo(models.Server, { foreignKey: 'serverId', as: 'server' });
    CustomCommand.belongsTo(models.Feature, { foreignKey: 'featureId', as: 'feature' }); // New Association
  };

  return CustomCommand;
};
