const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class outcomeDrivers extends Model {}

outcomeDrivers.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tierLevel: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    subTier: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "outcomeDrivers",
  }
);

module.exports = outcomeDrivers;
