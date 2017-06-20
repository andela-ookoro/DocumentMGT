
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
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
      synopsis: {
        type: Sequelize.STRING,
        allowNull: true
      },
      body: {
        type: Sequelize.STRING,
        allowNull: false
      },
      accessRight: {
        type: Sequelize.INTEGER,
        references: {
          model: 'accessRights',
          key: 'id',
          as: 'accessRightId',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      role: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      owner: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
          as: 'userId',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
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
    return queryInterface.dropTable('documents');
  }
};
