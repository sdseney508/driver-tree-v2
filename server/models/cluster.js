const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class clusters extends Model { }

clusters.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        outcomeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'outcomes',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'clusters',
    }
);

module.exports = clusters;
