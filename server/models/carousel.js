const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class carousel extends Model { }

carousel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        carouselText: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        carouselTitle: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        carouselImage: {
            type: DataTypes.BLOB,
            allowNull: true,
        },

        carouselLink: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'carousel',
    }
);

module.exports = carousel;
