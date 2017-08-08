'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utilities = require('./helpers/utilities');

var _index = require('../models/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Role = _index2.default.role;
var User = _index2.default.user;

module.exports = {
  /**
  * - get a list of roles
  * @param {*} req - client request
  * @param {*} res - server response
  * @return {null} -
  */
  getRoles: function getRoles(req, res) {
    var hint = {};
    var offset = parseInt(req.query.offset, 10) || 0;
    var limit = parseInt(req.query.limit, 6);
    if (req.query.offset || req.query.limit) {
      hint = { offset: offset, limit: limit };
    }

    // get all enable role
    Role.findAll(_extends({
      attributes: ['id', 'title', 'description'],
      order: [['title', 'ASC']],
      where: {
        status: 'enable'
      }
    }, hint)).then(function (roles) {
      return (0, _utilities.sendData)(res, roles, 200, 'roles');
    }).catch(function (error) {
      return (0, _utilities.sendMessage)(res, error.message, 500);
    });
  },

  /**
   * - create Role
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {null} -
   */
  createRole: function createRole(req, res) {
    // create object from request
    var role = req.body;

    // check for required fields
    if (role.title) {
      Role.create(role).then(function (newRole) {
        return (0, _utilities.sendData)(res, newRole, 201, 'role');
      }).catch(function (err) {
        return (0, _utilities.sendMessage)(res, err.message, 500);
      });
    } else {
      (0, _utilities.sendMessage)(res, 'Role title is compulsory.', 500);
    }
  },

  /**
   * - get role by id
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {null} -
   */
  getRole: function getRole(req, res) {
    // get user with this id
    var roleId = parseInt(req.params.id, 10);
    if (isNaN(roleId)) {
      return (0, _utilities.sendMessage)(res, 'Invalid role ID', 400);
    }
    Role.findOne({
      where: { id: roleId }
    }).then(function (role) {
      if (!role) {
        return (0, _utilities.sendMessage)(res, 'Role not found.', 200);
      }
      return (0, _utilities.sendData)(res, role, 200, 'role');
    }).catch(function (error) {
      return (0, _utilities.sendMessage)(res, error.message, 400);
    });
  },

  /**
   * - update role with id
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {null} -
   */
  updateRole: function updateRole(req, res) {
    // get new user info
    var changes = req.body;
    var roleId = parseInt(req.params.id, 10);
    if (isNaN(roleId)) {
      return (0, _utilities.sendMessage)(res, 'Invalid role ID', 400);
    }
    Role.findOne({
      where: { id: roleId }
    }).then(function (role) {
      if (!role) {
        return (0, _utilities.sendMessage)(res, 'Role not found.', 200);
      }
      return role.update(_extends({}, changes)).then(function () {
        return (0, _utilities.sendData)(res, role, 200, 'role');
      }).catch(function (error) {
        return (0, _utilities.sendMessage)(res, error.message, 400);
      });
    }).catch(function (error) {
      return (0, _utilities.sendMessage)(res, error.message, 400);
    });
  },

  /**
   * - delete role with id
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {null} -
   */
  deleteRole: function deleteRole(req, res) {
    // get document with this id
    var roleId = parseInt(req.params.id, 10);
    if (isNaN(roleId)) {
      return (0, _utilities.sendMessage)(res, 'Invalid role ID', 400);
    }
    Role.findOne({
      where: { id: roleId }
    }).then(function (role) {
      if (!role) {
        return (0, _utilities.sendMessage)(res, 'Role not found.', 200);
      }

      return role.update({ status: 'disabled' }).then(function () {
        return (0, _utilities.sendData)(res, 'Role was been deleted', 200, 'message');
      }).catch(function (error) {
        return (0, _utilities.sendMessage)(res, error.message, 400);
      });
    }).catch(function (error) {
      return (0, _utilities.sendMessage)(res, error.message, 400);
    });
  },

  /**
  * - get user in a  role with id
  * @param {*} req - client request
  * @param {*} res - server response
  * @return {null} -
  */
  getUsers: function getUsers(req, res) {
    // get role with this id
    var roleId = parseInt(req.params.id, 10);
    if (isNaN(roleId)) {
      return (0, _utilities.sendMessage)(res, 'Invalid role ID', 400);
    }
    Role.findOne({
      where: { id: roleId }
    }).then(function (role) {
      if (!role) {
        return (0, _utilities.sendMessage)(res, 'Role not found.', 200);
      }
      // return user's documents
      return User.findAll({
        where: { roleId: req.params.id }
      }).then(function (users) {
        if (!users) {
          return (0, _utilities.sendMessage)(res, 'Users not found.', 200);
        }
        return (0, _utilities.sendData)(res, users, 200, 'users');
      }).catch(function (error) {
        return (0, _utilities.sendMessage)(res, error.message, 400);
      });
    }).catch(function (error) {
      return (0, _utilities.sendMessage)(res, error.message, 400);
    });
  }
};