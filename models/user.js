'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile)
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Use email format"
        },
        notNull: {
          msg: "Email is required"
        },
        notEmpty: {
          msg: "Email is required"
        },
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password is required"
        },
        notEmpty: {
          msg: "Password is required"
        },
        passwordLenght(value) {
          if (value.length < 5) {
            throw new Error("Password length minimum is 5");
          }
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Role is required"
        },
        notEmpty: {
          msg: "Role is required"
        },
        isIn: {
          args: [['Admin', 'Customer', 'Guest']],
          msg: "Must be Admin or Customer"
        }
      }
    },
  }, {
    hooks: {
      beforeCreate: (user, options) => {
        user.password = hashPassword(user.password);
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};