'use strict';

module.exports = function (sequelize, DataTypes) {
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
  }, {});
  return accessRight;
};