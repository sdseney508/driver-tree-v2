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

        driverTrainStatus: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'Green',
        },

        //used to show whether the driver is active or not.  this prevents someone from deleting a driver that is in use.  When selecting delete on the drivertree page, it will set this to inactive and it will no longer render on the page.  If this was done in error, the admin can go and change the state back to active and it will reappear on the page.
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Active',
        },
        stakeholders: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        stakeholderAbbreviation: {
            type: DataTypes.STRING,
            allowNull: true,
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
