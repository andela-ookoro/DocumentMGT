
module.exports = (sequelize, DataTypes) => {
  const accessRight = sequelize.define('accessRight', {
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
  });
  return accessRight;
};
