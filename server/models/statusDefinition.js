const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class statusDefinition extends Model { }

statusDefinition.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        statusDefinition: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'statusDefinition',
    }
);

module.exports = statusDefinition;
