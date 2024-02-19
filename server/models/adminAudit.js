const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class adminAudit extends Model { }

adminAudit.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        model: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fieldName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        tableUid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        oldData: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        newData: {
            type: DataTypes.TEXT,
            allowNull: false,
        },  
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'adminAudit',
    }
);

module.exports = adminAudit;