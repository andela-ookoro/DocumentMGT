'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _mockData = require('./mockData');

var _mockData2 = _interopRequireDefault(_mockData);

var _server = require('../../server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Require the dev-dependencie
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var request = _supertest2.default.agent(_server2.default);
chai.use(chaiHttp);