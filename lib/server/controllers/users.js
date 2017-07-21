'use strict';

var _module$exports;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _index = require('../models/index');

var _index2 = _interopRequireDefault(_index);

var _utilities = require('./helpers/utilities');

var _config = require('../config/config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// connecct to postgrres
var env = process.env.NODE_ENV || 'development';
var DBconfig = _config2.default[env];

var sequelize = void 0;
if (DBconfig.use_env_variable) {
  sequelize = new _sequelize2.default(process.env[DBconfig.use_env_variable]);
} else {
  sequelize = new _sequelize2.default(DBconfig.database, DBconfig.username, DBconfig.password, DBconfig);
}

var User = _index2.default.user;
var Document = _index2.default.document;
var docAttributes = ['id', 'title', 'synopsis', 'body', 'role', 'accessRight', 'owner', 'author', 'createdAt', 'updatedAt'];

module.exports = (_module$exports = {
  /**
  * - login registered users
  * @param {*} req - client request
  * @param {*} res - server response
  * @return {object} - jwt
  */
  login: function login(req, res) {
    // create object from request
    var user = req.body;
    // check for required fields
    if (user.email && user.password) {
      // get user with this email
      return User.find({
        where: {
          email: user.email
        }
      }).then(function (foundUser) {
        if (foundUser) {
          var userPassword = foundUser.password;
          // check if user is disabled
          if (foundUser.status === 'disabled') {
            return (0, _utilities.sendMessage)(res, 'This account is blocked, Please account admin', 401);
          }
          // compare password
          var pass = _bcryptNodejs2.default.compareSync(user.password, userPassword);
          if (pass) {
            return (0, _utilities.returnJWt)(res, foundUser.dataValues, 200);
          }
          return (0, _utilities.sendMessage)(res, 'Wrong email or password.', 401);
        }
        return (0, _utilities.sendMessage)(res, 'Wrong email or password.', 401);
      }).catch(function (err) {
        return (0, _utilities.sendMessage)(res, err.message, 401);
      });
    } else {
      return (0, _utilities.sendMessage)(res, 'Email and password are compulsory.', 401);
    }
  },

  /**
  * - logout user
  * @param {*} req - client request
  * @param {*} res - server response
  * @return {object} - redirect
  */
  logout: function logout(req, res) {
    req.logout();
    res.redirect('/');
  },

  /**
   * - get a list of registered users
   * @param {*} req - client requesit
   * @param {*} res - server response
   * @return {object} - users
   */
  getUsers: function getUsers(req, res) {
    // check it limit and offset where passed
    var offset = parseInt(req.query.offset, 10) || 0;
    var limit = parseInt(req.query.limit, 10) || 6;

    /**
     * build dynamic where clause from query parameter
     * delete offset and limit from request query
     * loop through query parameter to build a dynamic where clause
     */
    var whereClause = '';
    var criteria = req.query;
    delete criteria.limit;
    delete criteria.offset;
    delete criteria.token;
    var criterion = void 0;
    for (var key in criteria) {
      if (criteria.hasOwnProperty(key)) {
        criterion = ' users.' + key + ' iLike \'%' + criteria[key] + '%\'';
        if (whereClause === '') {
          whereClause = 'where  ' + criterion;
        } else {
          whereClause = whereClause + ' and ' + criterion;
        }
      }
    }

    var fetchRangeQuery = '\n     select CONCAT(fname, \' \', mname, \' \', lname) AS name,\n     users.id AS id,\n     users.status AS status,\n     users.email AS email,\n     count(documents.id) AS DocCount,\n     "users"."createdAt" AS "createdAt",\n     "roles"."title" as role\n     from "roles"\n     inner join "users"\n     on "users"."roleId" = "roles"."id"\n     left join documents \n     on users.id = documents.owner\n     ' + whereClause + '\n     group by documents.owner,fname,lname,\n       fname, users.id,users.status,"roles"."title"\n     order by users.fname\n     offset ' + offset + '\n     limit ' + limit + ';';

    // get count of users for pagnition
    var getUsersCount = '\n      select count(id) as count from users\n      ' + whereClause + '\n      ;';

    return sequelize.query(fetchRangeQuery).then(function (result) {
      var users = result[0];
      if (users.length > 0) {
        // create object to store users fetch and total number of users
        var usersPayload = {
          count: 0,
          rows: users
        };
        // get total number of users in category
        return sequelize.query(getUsersCount).then(function (countResult) {
          var count = countResult[0][0].count;
          usersPayload.count = parseInt(count, 10);
          return (0, _utilities.sendData)(res, usersPayload, 200);
        }).catch(function (error) {
          return (0, _utilities.sendMessage)(res, error.message, 500);
        });
      }
      return (0, _utilities.sendMessage)(res, 'No user was found', 200);
    }).catch(function (error) {
      return (0, _utilities.sendMessage)(res, error.message, 500);
    });
  },

  /**
   * create a user and return jwt and user name and email
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {object} - jwt
   */
  createUser: function createUser(req, res) {
    // create object from request
    var user = req.body;
    // check for required fields
    if (user.fname && user.lname && user.email && user.password && user.roleId) {
      // check if  user already exist
      return User.find({
        where: {
          email: user.email
        }
      }).then(function (foundUser) {
        // if user exist exist return error
        if (foundUser) {
          (0, _utilities.sendMessage)(res, 'Email already exist', 409);
        }
        return User.create(user).then(function (newuser) {
          return (0, _utilities.returnJWt)(res, newuser.dataValues, 201);
        }).catch(function (err) {
          return (0, _utilities.sendMessage)(res, err.message, 500);
        });
      }).catch(function (err) {
        return (0, _utilities.sendMessage)(res, err.message, 500);
      });
    } else {
      (0, _utilities.sendMessage)(res, 'First name, last name, email, role  and password are compulsory.', 400);
    }
  },

  /**
   * get a user by id
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {object} - user
   */
  getUser: function getUser(req, res) {
    var userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      (0, _utilities.sendMessage)(res, 'Invalid user ID', 400);
    }
    // get user with this id
    return User.findOne({
      where: { id: userId },
      attributes: ['id', 'fname', 'lname', 'mname', 'email', 'roleId']
    }).then(function (user) {
      if (!user) {
        (0, _utilities.sendMessage)(res, 'User was not found.', 404);
      }
      (0, _utilities.sendData)(res, user, 200);
    }).catch(function (error) {
      return (0, _utilities.sendMessage)(res, error.message, 500);
    });
  },

  /**
   * detele user by id
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {string } - user fullname
   */
  deleteUser: function deleteUser(req, res) {
    // convert param to int
    var userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return (0, _utilities.sendMessage)(res, 'Invalid user ID', 400);
    }

    // get user with this id
    return User.findOne({
      where: { id: userId }
    }).then(function (user) {
      if (!user) {
        (0, _utilities.sendMessage)(res, 'User was not found.', 200);
      }

      return user.update({ status: 'disabled' }).then(function () {
        return (0, _utilities.sendData)(res, 'User has been blocked successfully', 200);
      }).catch(function (error) {
        return (0, _utilities.sendMessage)(res, error.message, 400);
      });
    }).catch(function (error) {
      return (0, _utilities.sendMessage)(res, error.message, 400);
    });
  }
}, _defineProperty(_module$exports, 'deleteUser', function deleteUser(req, res) {
  // convert param to int
  var userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return (0, _utilities.sendMessage)(res, 'Invalid user ID', 400);
  }

  // get user with this id
  return User.findOne({
    where: { id: userId }
  }).then(function (user) {
    if (!user) {
      (0, _utilities.sendMessage)(res, 'User was not found.', 200);
    }

    return user.update({ status: 'disabled' }).then(function () {
      return (0, _utilities.sendData)(res, 'User has been blocked successfully', 200);
    }).catch(function (error) {
      return (0, _utilities.sendMessage)(res, error.message, 400);
    });
  }).catch(function (error) {
    return (0, _utilities.sendMessage)(res, error.message, 400);
  });
}), _defineProperty(_module$exports, 'blockUser', function blockUser(req, res) {
  // convert param to int
  var userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return (0, _utilities.sendMessage)(res, 'Invalid user ID', 400);
  }

  // get user with this id
  return User.findOne({
    where: { id: userId }
  }).then(function (user) {
    if (!user) {
      (0, _utilities.sendMessage)(res, 'User was not found.', 200);
    }

    return user.update({ status: 'disabled' }).then(function () {
      return (0, _utilities.sendData)(res, 'User has been blocked successfully', 200);
    }).catch(function (error) {
      return (0, _utilities.sendMessage)(res, error.message, 400);
    });
  }).catch(function (error) {
    return (0, _utilities.sendMessage)(res, error.message, 400);
  });
}), _defineProperty(_module$exports, 'restoreUser', function restoreUser(req, res) {
  // convert param to int
  var userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return (0, _utilities.sendMessage)(res, 'Invalid user ID', 400);
  }

  // get user with this id
  return User.findOne({
    where: { id: userId }
  }).then(function (user) {
    if (!user) {
      (0, _utilities.sendMessage)(res, 'User was not found.', 200);
    }

    return user.update({ status: 'active' }).then(function () {
      return (0, _utilities.sendData)(res, 'User has been restored successfully', 200);
    }).catch(function (error) {
      return (0, _utilities.sendMessage)(res, error.message, 400);
    });
  }).catch(function (error) {
    return (0, _utilities.sendMessage)(res, error.message, 400);
  });
}), _defineProperty(_module$exports, 'updateUser', function updateUser(req, res) {
  var userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    (0, _utilities.sendMessage)(res, 'Invalid user ID', 400);
  }
  // only an admin can update a user's role
  if (req.body.role && req.user.title !== 'admin') {
    return (0, _utilities.sendMessage)(res, 'Invalid operation', 403);
  } // only an admin update another user's profile
  else if (req.user.title !== 'admin' && userId !== req.user.id) {
      return (0, _utilities.sendMessage)(res, 'Invalid operation', 403);
    }

  // check if old password was provide
  var curPassword = req.body.curPassword;
  if (curPassword) {
    // find user
    return User.findOne({
      where: { id: userId }
    }).then(function (foundUser) {
      if (!foundUser) {
        (0, _utilities.sendMessage)(res, 'User was not found', 200);
      }
      // verify user's password
      var pass = _bcryptNodejs2.default.compareSync(curPassword, foundUser.password);
      var test = _bcryptNodejs2.default.hashSync(curPassword, _bcryptNodejs2.default.genSaltSync(10));
      var test1 = _bcryptNodejs2.default.hashSync(curPassword);
      if (pass) {
        // create changes
        var changes = {
          fname: req.body.fname || foundUser.fname,
          lname: req.body.lname || foundUser.lname,
          mname: req.body.mname || foundUser.mname,
          email: req.body.email || foundUser.email,
          roleId: req.body.roleId || foundUser.roleId
        };
        // check if the user wants to change her password
        if (req.body.password) {
          changes.password = req.body.password;
        }
        return foundUser.update(_extends({}, changes)).then(function (updateUser) {
          return (0, _utilities.returnJWt)(res, updateUser.dataValues, 200);
        }).catch(function (error) {
          return (0, _utilities.sendMessage)(res, error.message, 500);
        });
      }
      return (0, _utilities.sendMessage)(res, 'Unauthorized operation, check the credential provided1', 403);
    }).catch(function (error) {
      var message = error.message || error.toString();
      return (0, _utilities.sendMessage)(res, message, 500);
    });
  }
  return (0, _utilities.sendMessage)(res, 'Unauthorized operation, check the credential provided2', 403);
}), _defineProperty(_module$exports, 'lookupUser', function lookupUser(req, res) {
  // get new user info
  var query = req.query;
  // get user with this id
  return User.findAndCountAll({
    where: _extends({}, query),
    attributes: ['id', 'fname', 'lname', 'mname', 'email', 'roleId']
  }).then(function (users) {
    if (!users) {
      (0, _utilities.sendMessage)(res, 'No user was found.', 200);
    }
    (0, _utilities.sendData)(res, users, 200);
  }).catch(function (error) {
    return (0, _utilities.sendMessage)(res, error.message, 400);
  });
}), _defineProperty(_module$exports, 'getUserDocument', function getUserDocument(req, res) {
  // get user with this id
  var userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return (0, _utilities.sendMessage)(res, 'Invalid user ID', 400);
  }
  if (userId !== req.user.id) {
    return (0, _utilities.sendMessage)(res, 'User was not found.', 200);
  }
  return User.findOne({
    where: { id: userId }
  }).then(function (user) {
    if (!user) {
      return (0, _utilities.sendMessage)(res, 'User was not found.', 200);
    }
    // return user's documents
    return Document.findAndCountAll({
      where: { owner: userId },
      attributes: docAttributes
    }).then(function (documents) {
      if (!documents) {
        return (0, _utilities.sendMessage)(res, 'Document was not found.', 200);
      }
      return (0, _utilities.sendData)(res, documents, 200);
    }).catch(function (error) {
      return (0, _utilities.sendMessage)(res, error.message, 500);
    });
  }).catch(function (error) {
    return (0, _utilities.sendMessage)(res, error.message, 500);
  });
}), _module$exports);