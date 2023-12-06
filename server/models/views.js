const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class views extends Model {}

views.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    viewName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "New View",
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "views",
  }
);

module.exports = views;
