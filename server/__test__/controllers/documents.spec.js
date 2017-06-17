

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

import app from '../../../server';

import supertest from 'supertest';
const request = supertest.agent(app);
chai.use(chaiHttp);


//import mockdata
import mockdata from '../mockData';
let document =  mockdata.document;
let registeredDocument = {};

describe('/document ', () => {
  describe('POST /document ', () => {
    it('As a user , I should be able to create a document',(done) => {
      request
        .post('/documents')
        .send(document)
        .end((err, res) => {
          if(!err) {
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
        .send(document)
        .end((err, res) => {
          if(res) {
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
    it('A user should recieve a list of all documents when no query is passed',
    (done) => {
      request
        .get('/documents')
        .end((err, res) => {
          if(!err) {
            res.should.have.status(200);
            res.body.status.should.be.eql('success');
          }
          done();
        });
    });

    it('A user should recieve a limited list of documents starting from an index',
   (done) => {
      request
        .get('/documents?offset=2&limit=2')
        .end((err, res) => {
          if(!err) {
            res.should.have.status(200);
            res.body.status.should.be.eql('success');
          }
          done();
        });
    });
  });

  describe('GET /documents/:id ', () => {
    it('A user should get a document by id \'when id exist\'',(done) => {
      request
        .get('/documents/10')
        .end((err, res) => {
          if(!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist 
            if(!res.body.message) {
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
      .end((err, res) => {
        if(!err) {
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
        .end((err, res) => {
          if(!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist 
            if(!res.body.message) {
              res.body.status.should.be.eql('success');
              res.body.data
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
      .end((err, res) => {
        if(!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Document not found.');
        }
        done();
      });
    });
  })

  describe('DETELE /documents/:id ', () => {
    it('A user can delete a document by id \'when id exist\'',(done) => {
      request
        .delete(`/documents/${registeredDocument.id}`)
        .end((err, res) => {
          if(!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist 
            if(!res.body.message) {
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
      .end((err, res) => {
        if(!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Document not found.');
        } 
        done();
      });
    });
  });
});

