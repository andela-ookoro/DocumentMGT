module.exports = (sequelize, DataTypes) => {
  const document = sequelize.define('document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          arg: [2, 255],
          msg: 'should contain between 2 to 255 character'
        }
      }
    },
    synopsis: {
      type: DataTypes.STRING,
      allowNull: true
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          arg: [2, 5000],
          msg: 'should contain between 2 to 5000 character'
        }
      }
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    accessRight: {
      type: DataTypes.INTEGER,
      references: {
        model: 'accessRight',
        key: 'id',
        as: 'accessRightId',
      },
    },
    owner: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
        as: 'userId',
      },
    }
  }, {
    classMethods: {
      associate(models) {
        // has an owner
        document.belongsTo(models.user, {
          foriegnKey: 'userId',
          onDelete: 'CASCADE',
        });
        // has an owner
        document.belongsTo(models.accessRight, {
          foriegnKey: 'accessRightId',
          onDelete: 'CASCADE',
        });
      }
    }
  });
  return document;
};
