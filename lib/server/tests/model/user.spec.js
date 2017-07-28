'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _models = require('../../models');

var _models2 = _interopRequireDefault(_models);

var _mockData = require('../mockData');

var _mockData2 = _interopRequireDefault(_mockData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = _models2.default.user; /* eslint no-unused-expressions: "off"*/

var Role = _models2.default.role;
var badUser = _mockData2.default.badUser;
var mockUser = _mockData2.default.updateuser;
var mockRole = _mockData2.default.role;

describe('User Model', function () {
  var user = void 0;
  // create role
  before(function (done) {
    Role.create(mockRole).then(function (newRole) {
      // set user's role
      mockUser.roleId = newRole.id;
      done();
    }).catch(function () {
      done();
    });
  });
  describe('Create User', function () {
    it('should create new user', function (done) {
      User.create(mockUser).then(function (newuser) {
        user = newuser;
        (0, _expect2.default)(user).toExist('fname');
        done();
      }).catch(function (error) {
        done();
      });
    });

    it('created role should exist', function () {
      (0, _expect2.default)(user).toExist();
      (0, _expect2.default)(user).toExist('fname');
    });

    it('should create a user with hashed password', function () {
      (0, _expect2.default)(user.password).toNotEqual(mockUser.password);
    });
  });

  describe('User Validation', function () {
    it('requires fname field to create a user', function (done) {
      User.create(_mockData2.default.UserWithoutFirstname).catch(function (error) {
        (0, _expect2.default)(/notNull Violation/.test(error.message)).toBeTruthy;
        done();
      });
    });

    it('requires lname field to create a user', function (done) {
      User.create(_mockData2.default.UserWithoutlastname).catch(function (error) {
        (0, _expect2.default)(/notNull Violation/.test(error.message)).toBeTruthy;
        done();
      });
    });

    it('requires email field to create a user', function (done) {
      User.create(_mockData2.default.UserWithoutEmail).catch(function (error) {
        (0, _expect2.default)(/notNull Violation/.test(error.message)).toBeTruthy;
        done();
      });
    });

    it('ensure a user has a unique email', function (done) {
      User.create(mockUser).catch(function (error) {
        (0, _expect2.default)(/SequelizeUniqueConstraintError/.test(error.name)).toBeTruthy;
        done();
      });
    });
  });

  describe('Email Validation', function () {
    it('requires user mail to be in proper email format', function () {
      User.create(_mockData2.default.UserWithInvalidEmail).catch(function (error) {
        (0, _expect2.default)(/Validation error: Validation isEmail failed/.test(error.message)).toBeTruthy;
        (0, _expect2.default)(/SequelizeValidationError/.test(error.name)).toBeTruthy;
      });
    });
  });

  describe('First and Last name Validation', function () {
    it('first and last name should contain at least two alphabet', function () {
      User.create(_mockData2.default.UserWithInvalidName).catch(function (error) {
        (0, _expect2.default)(/Validation error: Validation is {2}failed/.test(error.message)).toBeTruthy;
        (0, _expect2.default)(/SequelizeValidationError/.test(error.name)).toBeTruthy;
      });
    });
  });
});