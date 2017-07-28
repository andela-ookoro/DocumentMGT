'use strict';

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (sequelize, DataTypes) {
  var user = sequelize.define('user', {
    lname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: ['^[a-z]+$', 'i'],
          msg: 'last name should contain only  alphabets'
        },
        len: {
          arg: [2, 20],
          msg: 'last name should contain between 2 to 20 letters'
        }
      }
    },
    fname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: ['^[a-z]+$', 'i'],
          msg: 'first name should contain only alphabets'
        },
        len: {
          arg: [2, 20],
          msg: 'first name should contain between 2 to 20 letters'
        }
      }
    },
    mname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Invalid email format'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          arg: [10, 20],
          msg: 'password should contain between 10 to 20 characters'
        }
      }
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    hashPassword: {
      type: DataTypes.STRING,
      allowNull: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      references: {
        model: 'role',
        key: 'id',
        as: 'roleId',
        deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active'
    }
  }, {
    classMethods: {
      associate: function associate(models) {
        // has parent table Role
        user.belongsTo(models.role, {
          foriegnKey: 'roleId',
          onDelete: 'CASCADE'
        });

        // user can have many documents
        user.hasMany(models.document, {
          foriegnKey: 'userId',
          as: 'documents',
          onDelete: 'CASCADE'
        });
      }
    },
    instanceMethods: {},
    hooks: {
      beforeCreate: function beforeCreate(newuser) {
        newuser.password = _bcryptNodejs2.default.hashSync(newuser.password);
      },
      beforeUpdate: function beforeUpdate(newuser) {
        newuser.password = _bcryptNodejs2.default.hashSync(newuser.password);
      }
    }
  });
  return user;
};