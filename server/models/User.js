const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");

class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [14],
      },
    },
    //this stores when a password was initially created and then every time it is updated.  This is used to determine if a password is expired during the login process.  the user must change their password if it is expired.  Refer
    passwordExpiration: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    //change everything below here to strings to make it easier for end user
    userStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Requested",
      //     references: {
      //       model: 'accountstatus',
      //       key: 'accountstatus_id',
      //  }
    },
    userRole: {
      type: DataTypes.STRING,
      allowNull: true,
      //     references: {
      //       model: 'role',
      //       key: 'role_id',
      //  }
    },
    userCommand: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "stakeholder",
        key: "id",
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (newUserData) => {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },

      beforeUpdate: async (updatedUserData) => {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );

        return updatedUserData;
      },
    },

    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: "user",
  }
);

module.exports = User;
