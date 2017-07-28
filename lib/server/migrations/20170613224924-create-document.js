'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return queryInterface.createTable('documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          is: {
            args: ['^[a-z]+$', 'i'],
            msg: 'should contain only  alphabets'
          },
          len: {
            arg: [2, 100],
            msg: 'should contain between 2 to 100 letters'
          }
        }
      },
      synopsis: {
        type: Sequelize.STRING(1000),
        allowNull: true
      },
      body: {
        type: Sequelize.STRING(5000),
        allowNull: false
      },
      accessRight: {
        type: Sequelize.STRING,
        allowNull: false
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
          as: 'userId'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      author: {
        type: Sequelize.STRING,
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
  down: function down(queryInterface, Sequelize) {
    return queryInterface.dropTable('documents');
  }
};