const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class audit extends Model { }

audit.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        log_entry: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'audit',
    }
);

module.exports = audit;