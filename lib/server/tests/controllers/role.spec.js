'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _server = require('../../../server');

var _server2 = _interopRequireDefault(_server);

var _mockData = require('../mockData');

var _mockData2 = _interopRequireDefault(_mockData);

var _index = require('../../models/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Role = _index2.default.role;
var User = _index2.default.user;
var should = _chai2.default.should();
var request = _supertest2.default.agent(_server2.default);
_chai2.default.use(_chaiHttp2.default);

var role = _mockData2.default.role;
var mockUser = {
  fname: _faker2.default.name.firstName(),
  lname: _faker2.default.name.lastName(),
  mname: _faker2.default.name.firstName(),
  password: '!smilesh2o',
  email: _faker2.default.internet.email(),
  roleId: 3
};
var roleWithoutTitle = _mockData2.default.roleWithoutTitle;
var registeredRole = {};
var adminUserId = void 0;

describe('/api/v1/role ', function () {
  // cache jwt and userinfo
  var jwt = void 0;

  // create user to own the request
  before(function (done) {
    // find or create admin role
    var adminRoleId = void 0;
    Role.findOrCreate({
      where: {
        title: 'admin'
      },
      defaults: {
        description: 'Admin role has full priviledges',
        status: 'enable'
      }
    }).spread(function (newrole, created) {
      var adminRole = newrole.get({
        plain: true
      });
      adminRoleId = adminRole.id;
      var wasCreated = created;
      // create admin account
      // set user role to admin
      mockUser.roleId = adminRoleId;
      mockUser.isAdmin = true;
      request.post('/api/v1/users').send(mockUser).end(function (err, res) {
        if (!err) {
          jwt = res.body.jwtToken;
          adminUserId = res.body.userInfo.id;
          done();
        }
      });
    });
  });

  // delete user after test
  after(function (done) {
    var id = adminUserId;
    User.destroy({
      where: {
        id: id
      }
    });
    done();
  });

  describe('POST /api/v1/roles ', function () {
    it('As a user , I should be able to create a role', function (done) {
      request.post('/api/v1/roles').send(role).set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          // store new Role for futher testing
          console.log('....................testign', res.body);
          registeredRole.title = res.body.role.title;
          registeredRole.id = res.body.role.id;
          res.should.have.status(201);
          res.body.role.title.should.be.eql(role.title);
          res.body.status.should.be.eql('success');
        }
        done();
      });
    });
    it('A user should recieve a message when compulsory' + 'fields are not provided', function (done) {
      request.post('/api/v1/roles').set('Authorization', jwt).send(roleWithoutTitle).end(function (err, res) {
        if (res) {
          res.should.have.status(500);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Role title is compulsory.');
        }
        done();
      });
    });
  });

  describe('GET /api/v1/roles ', function () {
    it('A user should recieve a list of roles', function (done) {
      request.get('/api/v1/roles').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('success');
          res.body.roles.should.be.an('array');
        }
        done();
      });
    });
  });

  describe('GET /api/v1/roles/:id ', function () {
    it('A user should get a role by id \'when id exist\'', function (done) {
      request.get('/api/v1/roles/' + registeredRole.id).set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
          } else {
            res.body.message.should.be.eql('Role not found.');
          }
        }
        done();
      });
    });

    it('A user should recieve \'Role not found\' for unknown roleid ', function (done) {
      request.get('/api/v1/roles/-2').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Role not found.');
        }
        done();
      });
    });
  });

  describe('PUT /api/v1/roles/:id ', function () {
    var updateRole = _mockData2.default.updateRole;

    it('A user should update a role by id \'when role exist\'', function (done) {
      request.put('/api/v1/roles/' + registeredRole.id).set('Authorization', jwt).send(updateRole).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
          } else {
            res.body.message.should.be.eql('Role not found.');
          }
        }
        done();
      });
    });

    it('A user should recieve \'Role not found\' for unknown roleid ', function (done) {
      request.put('/api/v1/roles/-2').set('Authorization', jwt).send(_mockData2.default.updatedocument).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Role not found.');
        }
        done();
      });
    });
  });

  describe('DETELE /api/v1/roles/:id ', function () {
    it('A user can delete a role by id \'when id exist\'', function (done) {
      request.delete('/api/v1/roles/' + registeredRole.id).set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
          } else {
            res.body.message.should.be.eql('role was been deleted');
          }
        }
        done();
      });
    });

    it('A user should recieve \'Role not found\' for unknown userid ', function (done) {
      request.delete('/api/v1/roles/-2').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Role not found.');
        }
        done();
      });
    });
  });

  describe('GET /api/v1/roles/:id/users ', function () {
    it('A user should get list of users belonging to a role by roleid ' + '\'when id exist\'', function (done) {
      request.get('/api/v1/roles/3/users').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
          } else {
            res.body.message.should.be.eql('Role not found.');
          }
        }
        done();
      });
    });

    it('A user should recieve \'Role not found\' for unknown roleid ', function (done) {
      request.get('/api/v1/roles/-2/users').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Role not found.');
        }
        done();
      });
    });
  });
});