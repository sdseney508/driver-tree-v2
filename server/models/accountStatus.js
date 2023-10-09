const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class accountStatus extends Model {}

accountStatus.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    accountstatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'accountstatus',
  }
);

module.exports = accountStatus;
