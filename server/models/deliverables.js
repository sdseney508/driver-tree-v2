const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class deliverables extends Model { }

deliverables.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        limitTitle: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Integrated Program Solutions is an Amazing Company',
        },

        limitNumber: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isDecimal: true,
            }
        },
        statusDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        olstat: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Draft',

        },
        olaircraft: {
            type: DataTypes.JSON,
            allowNull: true,

        },
        olSystem: { 
            type: DataTypes.JSON,
            allowNull: true,
        },

        olFunctionalArea: {
            type: DataTypes.JSON,
            allowNull: true,
        },

        olconfiguration: {  
            type: DataTypes.JSON,
            allowNull: true,
        },

        limitType: {
            type: DataTypes.STRING,
            allowNull: true,

        },
        statement: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Place Holder'
        },
        justification: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Place Holder'
        },
        crewActions: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Place Holder'
        },
        inspectionReq: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'Place Holder'
        },
        closureCrit: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'Place Holder'
        },

        admin_log: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'deliverables',
    }
);

module.exports = deliverables;
