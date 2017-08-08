
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('accessRights', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          is: {
            args: ['^[a-z]+$', 'i'],
            msg: 'should contain only  alphabets'
          },
          len: {
            arg: [2, 20],
            msg: 'should contain between 2 to 20 letters'
          }
        }
      },
      description: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'enable',
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('accessRights');
  }
};
