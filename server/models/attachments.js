const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class attachment extends Model { }

attachment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        attachment: {
            type: DataTypes.BLOB,
            allowNull: true,
        },

        statusDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'attachment',
    }
);

module.exports = attachment;
