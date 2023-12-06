const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class viewArrows extends Model {}

viewArrows.init(
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
    modelName: "viewArrows",
  }
);

module.exports = viewArrows;
