const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class arrows extends Model {}

//TODO:  add a startTier field to make the cascade update execute faster
arrows.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    stroke: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "red",
    },

    color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "black",
    },

    path:
    {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'grid',
    },

    gridBreak:
    {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '50%',
    },

    dashness: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },  
    

    strokeWidth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },

    start: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    end: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    startAnchor: {
      type: DataTypes.JSON,
      allowNull: false,

    },
    
    endAnchor: {
      type: DataTypes.JSON,
      allowNull: false,
 
    },
    
    headSize: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 6
    },

    passProps: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // outcomeID: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: "outcomes",
    //     key: "id",
    //   },
    // },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "arrows",
  }
);

module.exports = arrows;
