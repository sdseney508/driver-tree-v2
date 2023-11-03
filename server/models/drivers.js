const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class drivers extends Model { }

drivers.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        //todo:  make this into a JSON for an indentured list of problems
        problemStatement: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Draft Driver For Demo',
        },

        //todo:  make this into a JSON for an indentured list of barriers
        barrier: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Draft Barrier For Demo',
        },

        //todo:  have this autolink to the cards so that the tier ties to the correct card level
        tierLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },

        //todo: create a route to autoassign the subTier based on what else is in the Tier column.
        //TODO update subtier based on draggable position in the column
        subTier: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        cluster: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },

        //todo:  make this into a JSON for an indentured list of progress
        progress: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'Everything tracking to plan'
        },

        //todo:  make this into a JSON for an indentured list of background
        background: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        //TODO:  make this into a JSON for an indentured list of deliverables
        deliverables: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Draft Deliverables For Demo',
        },

        //TODO:  make this into a JSON for an indentured list of outcomes
        desiredOutcomes: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Draft Outcomes For Demo',
        },

        supportedCommanders: {
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
        stakeholders: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        stakeholderAbbreviation: {
            type: DataTypes.STRING,
            allowNull: true,
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
        modelName: 'drivers',
    }
);

module.exports = drivers;
