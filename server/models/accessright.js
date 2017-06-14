'use strict';
module.exports = function(sequelize, DataTypes) {
  var accessRight = sequelize.define('accessRight', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
        Roles.hasMany(models.document, {
          foreignKey: 'documentId',
          as: 'documents',
        });
      }
    }
  });
  return accessRight;
};
