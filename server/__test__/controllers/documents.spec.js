

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
            registeredDocument.title = document.title;
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
  });
});

