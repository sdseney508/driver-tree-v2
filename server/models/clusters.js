const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class clusters extends Model { }

clusters.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        clusterName: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'New Cluster',
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'clusters',
    }
);

module.exports = clusters;
