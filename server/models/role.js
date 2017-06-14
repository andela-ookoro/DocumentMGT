'use strict';
module.exports = function(sequelize, DataTypes) {
  var role = sequelize.define('role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len:{
          arg: [2,100],
          msg: 'should contain between 2 to 100 character'
        }
      }
     },
    description: {
      type: DataTypes.STRING,
      allowNull: true
     },
    status: {
      type: DataTypes.STRING,
      default: 'enable',
      allowNull: false
     }
  }, {
    classMethods: {
      associate: function(models) {
        // a role has many users
        Roles.hasMany(models.user, {
          foreignKey: 'roleId',
          as: 'users',
        });
      }
    }
  });
  return role;
};
