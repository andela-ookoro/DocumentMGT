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

var _index = require('../../models/index');

var _index2 = _interopRequireDefault(_index);

var _mockData = require('../mockData');

var _mockData2 = _interopRequireDefault(_mockData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Require the dev-dependencies
var Role = _index2.default.role;
var User = _index2.default.user;

var should = _chai2.default.should();
var request = _supertest2.default.agent(_server2.default);
_chai2.default.use(_chaiHttp2.default);

// import mockdata

var user = {
  fname: 'Dele',
  lname: 'Musa',
  mname: 'Ngozi',
  password: '!smilesh2o',
  email: _faker2.default.internet.email(),
  roleId: 3
};
var secondUser = _mockData2.default.user;
var regulerUser = {};
var adminUser = {};

describe('/api/v1/users ', function () {
  // cache jwt and userinfo
  var jwt = void 0;
  var testUser = void 0;

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
      user.roleId = adminRoleId;
      user.isAdmin = true;
      request.post('/api/v1/users').send(user).end(function (err, res) {
        if (!err) {
          jwt = res.body.jwtToken;
          // store registered user for futher testing
          adminUser.email = user.email;
          adminUser.password = user.password;
          adminUser.id = res.body.userInfo.id;
          done();
        }
      });
    });
  });

  // delete user after test
  after(function (done) {
    var id = [adminUser.id, regulerUser.id];
    User.destroy({
      where: {
        id: id
      }
    });
    done();
  });

  describe('POST /api/v1/users ', function () {
    it('A user should recieve a jwt token, user metadata and a status ' + 'after successful signup', function (done) {
      secondUser.email = 'u' + secondUser.email;
      secondUser.roleId = 1;
      request.post('/api/v1/users').send(secondUser).end(function (err, res) {
        if (!err) {
          res.should.have.status(201);
          res.body.status.should.be.eql('success');
          // save regular user credentials
          regulerUser = {
            email: secondUser.email,
            password: secondUser.password,
            id: res.body.userInfo.id,
            jwt: res.body.jwtToken
          };
        }
        done();
      });
    });

    it('A user should recieve a message when compulsory fields are not give', function (done) {
      user = _mockData2.default.UserWithoutFirstname;
      request.post('/api/v1/users').send(user).end(function (err, res) {
        if (res) {
          res.should.have.status(400);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('First name, last name, email, role' + '  and password are compulsory.');
        }
        done();
      });
    });
  });

  describe('GET /api/v1/users/login ', function () {
    it('A user should recieve a jwt token, user metadata and a status ' + 'after successful login', function (done) {
      request.post('/api/v1/users/login').send(adminUser).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('success');
        }
        done();
      });
    });

    it('A user should recieve a message after unsuccessful login', function (done) {
      adminUser.password += 'wrong';
      request.post('/api/v1/users/login').send(adminUser).end(function (err, res) {
        if (!err) {
          res.should.have.status(401);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Wrong email or password.');
        }
        done();
      });
    });

    it('A user should recieve a message when compulsory fields are not give', function (done) {
      adminUser.password = '';
      request.post('/api/v1/users/login').send(adminUser).end(function (err, res) {
        if (res) {
          res.should.have.status(401);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Email and password are compulsory.');
        }
        done();
      });
    });
  });

  describe('GET /api/v1/users ', function () {
    it('A user should recieve a list of all users when no query is passed', function (done) {
      request.get('/api/v1//users').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          // test response
          res.should.have.status(200);
          res.body.status.should.be.eql('success');
        }
        done();
      });
    });

    it('A user should recieve a limited list of users starting from an index', function (done) {
      request.get('/api/v1/users?offset=2&limit=5').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          // test response
          res.should.have.status(200);
          res.body.status.should.be.eql('success');
        }
        done();
      });
    });
  });

  describe('GET /api/v1/users/:id ', function () {
    it('A user should get a user by id \'when id exist\'', function (done) {
      request.get('/api/v1/users/' + adminUser.id).set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
          } else {
            res.body.message.should.be.eql('User was not found.');
          }
        }
        done();
      });
    });

    it('A user should recieve \'User was not found\' for unknown userid ', function (done) {
      request.get('/api/v1/users/-2').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          console.log('....................', res.body);
          res.should.have.status(200);
          res.body.status.should.be.eql('success');
        }
        done();
      });
    });
  });

  describe('GET /api/v1/search/users/?q={} ', function () {
    it('A user should get list of  user with a list of attributes', function (done) {
      request.get('/api/v1/search/users?fname=Cullen&lname=Luettgen').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
            res.body.users.rows.should.be.an('array');
          } else {
            res.body.status.should.be.eql('fail');
          }
        }
        done();
      });
    });
  });

  describe('GET /api/v1/users/:userId/documents ', function () {
    it('A user should get a documents belonging to a user by userid ' + '\'when id exist\'', function (done) {
      request.get('/api/v1/users/' + adminUser.id + '/documents').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
          } else {
            res.body.message.should.be.eql('User was not found.');
          }
        }
        done();
      });
    });

    it('A user should recieve \'User was not found\' for unknown userid ', function (done) {
      request.get('/api/v1/users/-2/documents').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('User was not found.');
        }
        done();
      });
    });
  });

  describe('PUT /api/v1/users/:id ', function () {
    var update = {
      curPassword: '!smilesh2o',
      fname: 'testinknknkkng'
    };
    it('A user should update a user by id \'when id exist\'', function (done) {
      request.put('/api/v1/users/' + adminUser.id).set('Authorization', jwt).send(update).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
          } else {
            res.body.message.should.be.eql('User was not found.');
          }
        }
        done();
      });
    });

    it('A user should recieve \'user was not found\' for unknown userid ', function (done) {
      request.put('/api/v1/users/-2').set('Authorization', jwt).send(update).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('User was not found');
        }
        done();
      });
    });
  });

  describe('DETELE /api/v1/users/:id ', function () {
    var message = 'This account is blocked, Please account the admin';

    it('An admin should recieve \'User was not found\' for unknown userid ', function (done) {
      request.delete('/api/v1/users/-2').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          res.body.message.should.be.eql('User was not found.');
        }
        done();
      });
    });

    it('An admin should recieve \'Invalid user ID\' for non numeric userid', function (done) {
      request.delete('/api/v1/users/a').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(400);
          res.body.message.should.be.eql('Invalid user ID');
        }
        done();
      });
    });

    it('An admin can delete a user by id \'when id exist\'', function (done) {
      request.delete('/api/v1/users/' + regulerUser.id).set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
          } else {
            res.body.message.should.be.eql('User has been blocked successfully');
          }
        }
        done();
      });
    });

    it('A blocked user should recieve text ' + message, function (done) {
      request.delete('/api/v1/users/' + regulerUser.id).set('Authorization', regulerUser.jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(401);
          res.body.message.should.be.eql('This account is blocked, Please contact the admin');
        }
        done();
      });
    });
  });

  describe('POST /users/restore/:id ', function () {
    var message = 'This account is blocked, Please account the admin';

    it('An admin should recieve \'User was not found\' for unknown userid ', function (done) {
      request.post('/api/v1/users/restore/-2').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          res.body.message.should.be.eql('User was not found.');
        }
        done();
      });
    });

    it('An admin should recieve \'Invalid user ID\' for non numeric userid', function (done) {
      request.post('/api/v1/users/restore/a').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(400);
          res.body.message.should.be.eql('Invalid user ID');
        }
        done();
      });
    });

    it('An admin can restore a user by id \'when id exist\'', function (done) {
      request.post('/api/v1/users/restore/' + regulerUser.id).set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
          } else {
            res.body.message.should.be.eql('User was not found.');
          }
        }
        done();
      });
    });
  });
});