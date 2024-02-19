const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class session extends Model { }

session.init(
    {
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
          },
          userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          lastActivity: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'session',
    }
);

module.exports = session;
