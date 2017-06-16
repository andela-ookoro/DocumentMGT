

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
let user =  mockdata.user;


/*
  * Test the /GET route
  */
describe('POST /users ', () => {

  it('should create a users ', (done) => {
    request
      .post('/users')
      .send(user)
      .end((err, res) => {
        if(!err) {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.status.should.be.eql('success');
        }
        done();
      });
  });

  it('it should not POST a user without fname, lname or email field', (done) => {
    user = mockdata.UserWithoutFirstname; 
    request
      .post('/users')
      .send(user)
      .end((err, res) => {
        if(res) {
          res.should.have.status(500);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('First name, last name, ' +
          'email and password are compulsory.');
        }
        done();
      });
  });

});

