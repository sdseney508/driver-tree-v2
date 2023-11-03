const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class stakeholder extends Model {

}

stakeholder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    stakeholderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'stakeholder',
  }
);

module.exports = stakeholder;
