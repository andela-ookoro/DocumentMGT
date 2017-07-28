'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _models = require('../../models');

var _models2 = _interopRequireDefault(_models);

var _mockData = require('../mockData');

var _mockData2 = _interopRequireDefault(_mockData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Role = _models2.default.role; /* eslint no-unused-expressions: "off"*/

var mockRole = _mockData2.default.role;

describe('Role Model', function () {
  var role = void 0;
  describe('Create Role', function () {
    it('should create new role', function (done) {
      Role.create(mockRole).then(function (createdRole) {
        role = createdRole;
        (0, _expect2.default)(role).toExist('title');
        done();
      });
    });

    it('created role should exist', function () {
      (0, _expect2.default)(role).toExist();
      (0, _expect2.default)(role).toExist('title');
    });
  });

  describe('Role Validation', function () {
    it('requires title field to create a role', function (done) {
      Role.create().catch(function (error) {
        (0, _expect2.default)(/notNull Violation/.test(error.message)).toBeTruthy;
        done();
      });
    });
    it('ensure a role has a unique title', function (done) {
      Role.create(mockRole).catch(function (error) {
        (0, _expect2.default)(/SequelizeUniqueConstraintError/.test(error.name)).toBeTruthy;
        done();
      });
    });
  });
});