const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class outcomes extends Model { }

outcomes.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        outcomeTitle: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Draft',
        },
    
        problemStatement: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Draft',
        },
        
        baselinePerformance: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Draft',
        },

   
        rootCauses: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Draft'
        },
        assumptions: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Draft',

        },
        
        scope: {    
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Draft',
        },

        goals: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Draft',
        },

        measurements: { 
            type: DataTypes.JSON,
            allowNull: true,
        },

        readyForStakeholder: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },

        supportedCommanders: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
         leadActionOfficer: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        relatedEfforts: {
            type: DataTypes.STRING,
            allowNull: true,

        },
        
        barriers: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        status: {   
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'Green',
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Draft',
        },

        version: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1,
        },

        subTierLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'outcomes',
    }
);

module.exports = outcomes;
