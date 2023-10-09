const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class role extends Model { }

role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'role',
    }
);

module.exports = role;
