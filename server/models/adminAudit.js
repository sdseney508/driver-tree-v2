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

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            },
        },

        model: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        oldData: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        newData: {
            type: DataTypes.STRING,
            allowNull: false,
        },  
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'adminAudit',
    }
);

module.exports = adminAudit;