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
        //Todo:  move this to its own table with a link to the outcome
        problemStatement: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Draft',
        },

        //command that owns the outcome.  from stakeholders table
        command: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
              model: "stakeholders",
              key: "id",
            },
          },

        
        baselinePerformance: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Draft',
        },

        //TODO:  move this to its own table with a link to the outcome
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

        //TODO:  move this to its own table with a link to the outcome or make this a JSON fed by a multi-select on a form.
        supportedCommanders: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
         leadActionOfficer: {
            type: DataTypes.STRING,
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
            allowNull: true,
            defaultValue: 'Green',
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Draft',
        },

        tierLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        subTierLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        cluster: {
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
