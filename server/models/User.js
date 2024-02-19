const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");

class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }

  // Add method to update lastLogin
  async updateLastLogin() {
    this.lastLogin = new Date(); // Set to current date and time
    this.save();
  }

  // Add method to update userStatus based on lastLogin
  async updateStatusBasedOnLastLogin(userId) {
    const user = await User.findByPk(userId);
    if (user && user.lastLogin) {
      const daysSinceLastLogin = (new Date() - new Date(user.lastLogin)) / (1000 * 60 * 60 * 24);
      //0 is for testing purposes, change to 35 for production
      if (daysSinceLastLogin > 35) {
        user.userStatus = 'Inactive'; // Assuming 'Inactive' is the status you use
        await user.save();
        return true;
      } else {
        return false;
      }
    }
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
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [14, 100]
      },
    },
    //this stores when a password was initially created and then every time it is updated.  This is used to determine if a password is expired during the login process.  the user must change their password if it is expired.  Refer
    passwordExpiration: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    //change everything below here to strings to make it easier for end user
    userStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Requested",
    },
    userRole: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    //store token in database vice the local storage
    loggedInToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate: async (newUserData) => {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        newUserData.passwordExpiration = new Date(
          Date.now() + 90 * 24 * 60 * 60 * 1000
        );
        return newUserData;
      },

      beforeUpdate: async (updatedUserData) => {
   
        //You need to check if the password has been changed since we update the last login on every login
        if (updatedUserData.changed('password')) {    
          // Proceed to hash the new password
          updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
          updatedUserData.passwordExpiration = new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000
          );
        }
      },
    },
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
    ],

    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: "user",
  }
);

module.exports = User;
