'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _models = require('../../models');

var _models2 = _interopRequireDefault(_models);

var _mockData = require('../mockData');

var _mockData2 = _interopRequireDefault(_mockData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Document = _models2.default.document; /* eslint no-unused-expressions: "off"*/

var User = _models2.default.user;

// mock data
var mockUser = _mockData2.default.user;
var mockDocument = _mockData2.default.document;

describe('Document Model', function () {
  var document = void 0;
  // create user to own the request
  before(function (done) {
    User.create(mockUser).then(function (newuser) {
      mockUser = newuser;
      // set document author and owner
      mockDocument.owner = newuser.id;
      mockDocument.author = newuser.fname;
      done();
    }).catch(function () {
      done();
    });
  });

  describe('Create document', function () {
    it('should create new dcument', function (done) {
      Document.create(mockDocument).then(function (newDocument) {
        document = newDocument;
        (0, _expect2.default)(document).toExist('title');
        done();
      }).catch(function (error) {
        done();
      });
    });

    it('created document should exist', function () {
      (0, _expect2.default)(document).toExist();
      (0, _expect2.default)(document).toExist('title');
    });
  });

  describe('Document Validation', function () {
    it('requires title field to create a document', function (done) {
      Document.create(_mockData2.default.DocumentWithoutTitle).catch(function (error) {
        (0, _expect2.default)(/notNull Violation/.test(error.message)).toBeTruthy;
        done();
      });
    });

    it('requires body field to create a document', function (done) {
      Document.create(_mockData2.default.DocumentWithoutBody).catch(function (error) {
        (0, _expect2.default)(/notNull Violation/.test(error.message)).toBeTruthy;
        done();
      });
    });
  });

  describe('Document\'s title  and body  Validation', function () {
    it('title  and body should contain at least two alphabet', function () {
      User.create(_mockData2.default.DocumentWithInvalidTitleBody).catch(function (error) {
        (0, _expect2.default)(/Validation error: Validation is {2}failed/.test(error.message)).toBeTruthy;
        (0, _expect2.default)(/SequelizeValidationError/.test(error.name)).toBeTruthy;
      });
    });
  });
});