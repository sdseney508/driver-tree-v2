const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class stakeholder_outcomes extends Model {

}

stakeholder_outcomes.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    stakeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stakeholder',
        key: 'id',
      },
    },
    outID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'outcomes',
        key: 'id',
      },
    },
    stakeholderAbbreviation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'stakeholder_outcomes',
  }
);

module.exports = stakeholder_outcomes;
