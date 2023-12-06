const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class viewCards extends Model {}

viewCards.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    

  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "viewCards",
  }
);

module.exports = viewCards;
