// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import expect from 'expect';
import app from '../../../server';
import mockdata from '../mockData';
import model from '../../models/index';

const Role = model.role;
const User = model.user;
const should = chai.should();
const request = supertest.agent(app);
chai.use(chaiHttp);


// import mockdata
const document = mockdata.document;
let mockUser = mockdata.user;
const registeredDocument = {};
let adminUserId;

describe('/api/v1/document', () => {
  // cache jwt and userinfo
  let jwt;
  let testUser;

  // create user to own the request
  before((done) => {
    // find or create admin role
    let adminRoleId;
    Role
      .findOrCreate({
        where: {
          title: 'admin'
        },
        defaults: {
          description: 'Admin role has full priviledges',
          status: 'enable'
        }
      })
      .spread((newrole, created) => {
        const adminRole = newrole.get({
          plain: true
        });
        adminRoleId = adminRole.id;
        const wasCreated = created;
         // create admin account
        // set user role to admin
        mockUser.roleId = adminRoleId;
        request
          .post('/api/v1/users')
          .send(mockUser)
          .end((err, res) => {
            if (!err) {
              jwt = res.body.jwtToken;
              testUser = res.body.userInfo;
              // set document owner to testUser
              document.owner = testUser.id;
              let adminUserId = testUser.id;
              done();
            }
          });
      });
  });

  // delete user after test
  after((done) => {
    const id = adminUserId
    User.destroy({ 
      where: { 
        id
      }
    });
    done();
  });

  describe('POST /document ', () => {
    it('As a user , I should be able to create a document', (done) => {
      request
        .post('/api/v1/documents')
        .set('Authorization', jwt)
        .send(document)
        .end((err, res) => {
          if (!err) {
            // store new document for futher testing
            if (res.body.status === 'success') {
              registeredDocument.title = res.body.document.title;
              registeredDocument.id = res.body.document.id;
              res.should.have.status(201);
              res.body.document.title.should.be.eql(document.title);
              res.body.status.should.be.eql('success');
            } else {
              expect(res.body).toExist('message');
            }
          }
          done();
        });
    });

    it('A user must provide the  document title and body', (done) => {
      document.title = '';
      request
        .post('/api/v1/documents')
        .set('Authorization', jwt)
        .send(document)
        .end((err, res) => {
          if (res) {
            res.should.have.status(500);
            res.body.status.should.be.eql('fail');
            res.body.message.should.be.eql('Document\'s title and body ' +
            'are compulsory.');
          }
          done();
        });
    });

  });

  describe('GET /documents ', () => {
    it('A user should recieve a list of all documents',
    (done) => {
      request
        .get('/api/v1/documents')
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            res.body.status.should.be.eql('success');
          }
          done();
        });
    });

    it('A user should recieve a list of documents starting from an index',
   (done) => {
     request
        .get('/api/v1/documents?offset=2&limit=2')
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            res.body.status.should.be.eql('success');
          }
          done();
        });
   });

   it('As a user, I recieve an error message when an error occurs', (done) => {
      request
        .get('/api/v1/documents?limit=a&offset=4')
        .set('Authorization', jwt)
        .send(document)
        .end((err, res) => {
          expect(res.body).toExist('message');
          res.should.have.status(500);
          res.body.status.should.be.eql('fail'); 
          done();
        });
    });
  });

  describe('GET /documents/:id ', () => {
    it('A user should get a document by id \'when id exist\'', (done) => {
      request
        .get(`/api/v1/documents/${registeredDocument.id}`)
        .set('Authorization', jwt)
        .end((err, res) => {
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

    it('A user should recieve \'Document not found\' for unknown documentid ',
    (done) => {
      request
      .get('/api/v1/documents/-2')
      .set('Authorization', jwt)
      .end((err, res) => {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Document not found.');
        }
        done();
      });
    });
  });

  describe('PUT /documents/:id ', () => {
    // changes to be made
    const changes = {
      title: 'new title from test'
    };
    it('A user should update a document by id \'when documents exist\'',
    (done) => {
      request
        .put(`/api/v1/documents/${registeredDocument.id}`)
        .send(changes)
        .set('Authorization', jwt)
        .end((err, res) => {
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

    it('A user should recieve \'Document not found\' for unknown documentid ',
    (done) => {
      request
      .put('/api/v1/documents/-2')
      .send(changes)
      .set('Authorization', jwt)
      .end((err, res) => {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Document not found.');
        }
        done();
      });
    });

    it('A user should not update the author or owner of a document', (done) => {
      changes.owner = 3;
      request
        .put(`/api/v1/documents/${registeredDocument.id}`)
        .send(changes)
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(400);
            res.body.message
            .should.be.eql('Invalid operation, you can not change author');
          }
          done();
        });
    });
  });

  describe('DETELE /documents/:id ', () => {
    it('A user can delete a document by id \'when id exist\'', (done) => {
      request
        .delete(`/api/v1/documents/${registeredDocument.id}`)
        .set('Authorization', jwt)
        .end((err, res) => {
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

    it('A user should recieve \'Document not found\' for unknown documentid',
    (done) => {
      request
      .delete('/api/v1/documents/-2')
      .set('Authorization', jwt)
      .end((err, res) => {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Document not found.');
        }
        done();
      });
    });
  });

  describe('GET /search/documents/?q={} ', () => {
    it('A user should get list of the documents', (done) => {
      request
        .get('/api/v1/search/documents')
        .set('Authorization', jwt)
        .end((err, res) => {
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

    it('A user should get list of the documents I created', (done) => {
      request
        .get('/api/v1/search/documents?accessRight=myDocument')
        .set('Authorization', jwt)
        .end((err, res) => {
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

    it('A user should get list of the documents shared in my role', (done) => {
      request
        .get('/api/v1/search/documents?accessRight=role')
        .set('Authorization', jwt)
        .end((err, res) => {
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

    it('A user should get list my private documents', (done) => {
      request
        .get('/api/v1/search/documents?accessRight=private')
        .set('Authorization', jwt)
        .end((err, res) => {
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

    it('A user should search for documents by title', (done) => {
      request
        .get('/api/v1/search/documents?title=e')
        .set('Authorization', jwt)
        .end((err, res) => {
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

    const noDoc = 'No document was found.';
    it(`A user should recieve a text ${noDoc}' when no document was found`,
    (done) => {
      request
        .get('/api/v1/search/documents?title=zzzzdddddpzkpzpkzpkpkpke')
        .set('Authorization', jwt)
        .end((err, res) => {
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

