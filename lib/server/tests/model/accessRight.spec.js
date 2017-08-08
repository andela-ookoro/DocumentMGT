'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _models = require('../../models');

var _models2 = _interopRequireDefault(_models);

var _mockData = require('../mockData');

var _mockData2 = _interopRequireDefault(_mockData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AccessRight = _models2.default.accessRight; /* eslint no-unused-expressions: "off"*/

var mockAccessRight = _mockData2.default.accessRight;

describe('AccessRight Model', function () {
  var accessRight = void 0;
  describe('Create AccessRight', function () {
    it('should create new accessRight', function (done) {
      AccessRight.create(mockAccessRight).then(function (newAccessRight) {
        accessRight = newAccessRight;
        (0, _expect2.default)(accessRight).toExist('title');
        done();
      });
    });

    it('created accessRight should exist', function () {
      (0, _expect2.default)(accessRight).toExist();
      (0, _expect2.default)(accessRight).toExist('title');
    });
  });

  describe('AccessRight Validation', function () {
    it('requires title field to create a accessRight', function (done) {
      AccessRight.create().catch(function (error) {
        (0, _expect2.default)(/notNull Violation/.test(error.message)).toBeTruthy;
        done();
      });
    });
    it('ensure a accessRight has a unique title', function (done) {
      AccessRight.create(mockAccessRight).catch(function (error) {
        (0, _expect2.default)(/SequelizeUniqueConstraintError/.test(error.name)).toBeTruthy;
        done();
      });
    });
  });
});