const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class arrows extends Model {}

arrows.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        arrowColor: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'black',
        },

        arrowWidth: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2,
        },

        card1ID: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        card2ID: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        outcomeID: {
            type: DataTypes.INTEGER,
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
        modelName: 'arrows',
    }
);