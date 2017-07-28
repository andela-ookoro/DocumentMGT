'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _server = require('../../../server');

var _server2 = _interopRequireDefault(_server);

var _mockData = require('../mockData');

var _mockData2 = _interopRequireDefault(_mockData);

var _index = require('../../models/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Role = _index2.default.role; // Require the dev-dependencies

var User = _index2.default.user;
var should = _chai2.default.should();
var request = _supertest2.default.agent(_server2.default);
_chai2.default.use(_chaiHttp2.default);

// import mockdata
var document = _mockData2.default.document;
var mockUser = _mockData2.default.user;
var registeredDocument = {};
var adminUserId = void 0;

describe('/api/v1/document', function () {
  // cache jwt and userinfo
  var jwt = void 0;
  var testUser = void 0;

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
          testUser = res.body.userInfo;
          // set document owner to testUser
          document.owner = testUser.id;
          var _adminUserId = testUser.id;
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

  describe('POST /document ', function () {
    it('As a user , I should be able to create a document', function (done) {
      request.post('/api/v1/documents').set('Authorization', jwt).send(document).end(function (err, res) {
        if (!err) {
          // store new document for futher testing
          if (res.body.status === 'success') {
            registeredDocument.title = res.body.document.title;
            registeredDocument.id = res.body.document.id;
            res.should.have.status(201);
            res.body.document.title.should.be.eql(document.title);
            res.body.status.should.be.eql('success');
          } else {
            (0, _expect2.default)(res.body).toExist('message');
          }
        }
        done();
      });
    });

    it('A user must provide the  document title and body', function (done) {
      document.title = '';
      request.post('/api/v1/documents').set('Authorization', jwt).send(document).end(function (err, res) {
        if (res) {
          res.should.have.status(400);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Document\'s title and body ' + 'are compulsory.');
        }
        done();
      });
    });
  });

  describe('GET /documents ', function () {
    it('A user should recieve a list of all documents', function (done) {
      request.get('/api/v1/documents').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('success');
        }
        done();
      });
    });

    it('A user should recieve a list of documents starting from an index', function (done) {
      request.get('/api/v1/documents?offset=2&limit=2').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('success');
        }
        done();
      });
    });

    it('As a user, I recieve an error message when an error occurs', function (done) {
      request.get('/api/v1/documents?limit=a&offset=4').set('Authorization', jwt).send(document).end(function (err, res) {
        (0, _expect2.default)(res.body).toExist('message');
        res.should.have.status(500);
        res.body.status.should.be.eql('fail');
        done();
      });
    });
  });

  describe('GET /documents/:id ', function () {
    it('A user should get a document by id \'when id exist\'', function (done) {
      request.get('/api/v1/documents/' + registeredDocument.id).set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
          } else {
            res.body.message.should.be.eql('Document not found.');
          }
        }
        done();
      });
    });

    it('A user should recieve \'Document not found\' for unknown documentid ', function (done) {
      request.get('/api/v1/documents/-2').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Document not found.');
        }
        done();
      });
    });
  });

  describe('PUT /documents/:id ', function () {
    // changes to be made
    var changes = {
      title: 'new title from test'
    };
    it('A user should update a document by id \'when documents exist\'', function (done) {
      request.put('/api/v1/documents/' + registeredDocument.id).send(changes).set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
          } else {
            res.body.message.should.be.eql('Document not found.');
          }
        }
        done();
      });
    });

    it('A user should recieve \'Document not found\' for unknown documentid ', function (done) {
      request.put('/api/v1/documents/-2').send(changes).set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Document not found.');
        }
        done();
      });
    });

    it('A user should not update the author or owner of a document', function (done) {
      changes.owner = 3;
      request.put('/api/v1/documents/' + registeredDocument.id).send(changes).set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(400);
          res.body.message.should.be.eql('Invalid operation, you can not change author');
        }
        done();
      });
    });
  });

  describe('DETELE /documents/:id ', function () {
    it('A user can delete a document by id \'when id exist\'', function (done) {
      request.delete('/api/v1/documents/' + registeredDocument.id).set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
          } else {
            res.body.message.should.be.eql('Document not found.');
          }
        }
        done();
      });
    });

    it('A user should recieve \'Document not found\' for unknown documentid', function (done) {
      request.delete('/api/v1/documents/-2').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Document not found.');
        }
        done();
      });
    });
  });

  describe('GET /search/documents/?q={} ', function () {
    it('A user should get list of the documents', function (done) {
      request.get('/api/v1/search/documents').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
            res.body.documents.rows.should.be.an('array');
          } else {
            res.body.message.should.be.eql('No document was found.');
          }
        }
        done();
      });
    });

    it('A user should get list of the documents I created', function (done) {
      request.get('/api/v1/search/documents?accessRight=myDocument').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
            res.body.documents.rows.should.be.an('array');
          } else {
            res.body.message.should.be.eql('No document was found.');
          }
        }
        done();
      });
    });

    it('A user should get list of the documents shared in my role', function (done) {
      request.get('/api/v1/search/documents?accessRight=role').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
            res.body.documents.rows.should.be.an('array');
          } else {
            res.body.message.should.be.eql('No document was found.');
          }
        }
        done();
      });
    });

    it('A user should get list my private documents', function (done) {
      request.get('/api/v1/search/documents?accessRight=private').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
            res.body.documents.rows.should.be.an('array');
          } else {
            res.body.message.should.be.eql('No document was found.');
          }
        }
        done();
      });
    });

    it('A user should search for documents by title', function (done) {
      request.get('/api/v1/search/documents?title=e').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
            res.body.documents.rows.should.be.an('array');
          } else {
            res.body.message.should.be.eql('No document was found.');
          }
        }
        done();
      });
    });

    var noDoc = 'No document was found.';
    it('A user should recieve a text ' + noDoc + '\' when no document was found', function (done) {
      request.get('/api/v1/search/documents?title=zzzzdddddpzkpzpkzpkpkpke').set('Authorization', jwt).end(function (err, res) {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
            res.body.documents.rows.should.be.an('array');
          } else {
            res.body.message.should.be.eql('No document was found.');
          }
        }
        done();
      });
    });
  });
});