// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';

import app from '../../../server';
import mockdata from '../mockData';



const request = supertest.agent(app);
chai.use(chaiHttp);


// import mockdata
const document = mockdata.document;
let mockUser = mockdata.user;
const registeredDocument = {};

describe('/document ', () => {
  // cache jwt and userinfo
  let jwt;
  let testUser;

  // create user to own the request
  before((done) => {
    console.log('should run first');
    request
    .post('/users')
    .send(mockUser)
    .end((err, res) => {
      if (!err) {
        jwt = res.body.jwtToken;
        testUser = res.body.userInfo;
        // set document owner to testUser
        document.owner = testUser.id;
        done();
      }
    });
  });

  // delete user after test
  after((done) => {
    request
    .delete('/users/1')
    .set('Authorization', jwt)
    .end((err, res) => {
      if (!err) {
        done();
      }
    });
  });

  describe('POST /document ', () => {
    it('As a user , I should be able to create a document', (done) => {
      request
        .post('/documents')
        .set('Authorization', jwt)
        .send(document)
        .end((err, res) => {
          if (!err) {
            // store new document for futher testing
            registeredDocument.title = res.body.data.title;
            registeredDocument.id = res.body.data.id;
            res.should.have.status(201);
            res.body.data.title.should.be.eql(document.title);
            res.body.status.should.be.eql('success');
          }
          done();
        });
    });

    it('A user must provide the  document title and body', (done) => {
      document.title = '';
      request
        .post('/documents')
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
        .get('/documents')
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
        .get('/documents?offset=2&limit=2')
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            res.body.status.should.be.eql('success');
          }
          done();
        });
   });
  });

  describe('GET /documents/:id ', () => {
    it('A user should get a document by id \'when id exist\'', (done) => {
      request
        .get(`/documents/${registeredDocument.id}`)
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
      .get('/documents/-2')
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
    it('A user should update a document by id \'when documents exist\'',
    (done) => {
      request
        .put('/documents/10')
        .send(mockdata.updatedocument)
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist
            if (!res.body.message) {
              res.body.status.should.be.eql('success');
              res.body.data;
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
      .put('/documents/-2')
      .send(mockdata.updatedocument)
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

  describe('DETELE /documents/:id ', () => {
    it('A user can delete a document by id \'when id exist\'', (done) => {
      request
        .delete(`/documents/${registeredDocument.id}`)
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
      .delete('/documents/-2')
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
    it('A user should get list of  user with a list of attributes', (done) => {
      request
        .get('/search/documents?role=1')
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist
            if (!res.body.message) {
              res.body.status.should.be.eql('success');
              res.body.data.rows.should.be.an('array');
            } else {
              res.body.message.should.be.eql('No document found.');
            }
          }
          done();
        });
    });
  });
});

