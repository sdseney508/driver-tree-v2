const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class state extends Model { }

state.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'state',
    }
);

module.exports = state;
