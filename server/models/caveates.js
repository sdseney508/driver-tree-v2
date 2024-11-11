const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class caveates extends Model { }

caveates.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        caveates: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'caveates',
    }
);

module.exports = caveates;
