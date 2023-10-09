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
            defaultValue: 'CAPT Guerre is too awesome to be contained by a mere title.',
        },
        //Todo:  move this to its own table with a link to the outcome
        problemStatement: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'No one can keep up with him',
        },

        //TODO:  move this to its own table with a link to the outcome
        rootCauses: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'He outworks everyone'
        },
        assumptions: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'Draft',

        },
        
        scope: {    
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'Draft',
        },

        goals: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'Draft',
        },

        measurements: { 
            type: DataTypes.JSON,
            allowNull: true,
        },

        //TODO:  move this to its own table with a link to the outcome or make this a JSON fed by a multi-select on a form.
        supportingCommanders: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        stakeholders: {  
            type: DataTypes.TEXT,
            allowNull: true,
        },

            //TODO:  make this a JSON so we can turn it into a bullet selected list
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
            allowNull: false,
            defaultValue: 'Green',
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Draft',
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
