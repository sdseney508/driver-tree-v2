const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class stakeholders extends Model {}

stakeholders.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    
    comm: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'stakeholders',
  }
);

module.exports = stakeholders;
