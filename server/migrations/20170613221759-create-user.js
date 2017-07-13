
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fname: {
        type: Sequelize.STRING,
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
      lname: {
        type: Sequelize.STRING,
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
      mname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        defaultValue: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Invalid email format'
          },
        }
      },
      roleId: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        references: {
          model: 'roles',
          key: 'id',
          as: 'roleId',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      password: {
        type: Sequelize.STRING
      },
      hashPassword: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'active',
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
    return queryInterface.dropTable('users');
  }
};
