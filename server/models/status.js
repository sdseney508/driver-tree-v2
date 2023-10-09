const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class status extends Model { }

status.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'status',
    }
);

module.exports = status;
