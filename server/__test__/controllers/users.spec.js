

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
let registeredUser = {};

describe('/users ', () => {
  describe('POST /users ', () => {
    it('A user should recieve a jwt token, user metadata and a status ' + 
    'after successful signup',
    (done) => {
      request
        .post('/users')
        .send(user)
        .end((err, res) => {
          if(!err) {
            // store registered user for futher testing
            registeredUser.email = user.email;
            registeredUser.password = user.password;
            // test response
            res.should.have.status(201);
            res.body.data.email.should.be.eql(user.email);
            res.body.status.should.be.eql('success');
          }
          done();
        });
    });

    it('A user should recieve a message when compulsory fields are not give',
    (done) => {
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

  describe('GET /users/login ', () => {
    it('A user should recieve a jwt token, user metadata and a status ' + 
    'after successful login',
    (done) => {
      request
        .get('/users/login')
        .send(registeredUser)
        .end((err, res) => {
          if(!err) {
            res.should.have.status(200);
            res.body.data.email.should.be.eql(registeredUser.email);
            res.body.status.should.be.eql('success');
          }
          done();
        });
    });

    it('A user should recieve a message after unsuccessful login',
    (done) => {
      registeredUser.password += 'wrong';
      request
        .get('/users/login')
        .send(registeredUser)
        .end((err, res) => {
          if(!err) {
            res.should.have.status(401);
            res.body.status.should.be.eql('fail');
            res.body.message.should.be.eql('Wrong email or password.');
          }
          done();
        });
    });

    it('A user should recieve a message when compulsory fields are not give',
    (done) => {
      registeredUser.password = '';
      request
        .get('/users/login')
        .send(registeredUser)
        .end((err, res) => {
          if(res) {
            res.should.have.status(500);
            res.body.status.should.be.eql('fail');
            res.body.message.should.be.eql('Email and password are compulsory.');
          }
          done();
        });
    });
  });

  describe('GET /users ', () => {
    it('A user should recieve a list of all users when no query is passed',
    (done) => {
      request
        .get('/users')
        .end((err, res) => {
          if(!err) {
            // test response
            res.should.have.status(200);
            res.body.status.should.be.eql('success');
          }
          done();
        });
    });

   it('A user should recieve a list of all users', (done) => {
      request
        .get('/users?offset=2&limit=5')
        .end((err, res) => {
          if(!err) {
            // test response
            res.should.have.status(200);
            res.body.status.should.be.eql('success');
          }
          done();
        });
    });
  });

  describe('GET /users/:id ', () => {
    it('A user should get a user by id \'when id exist\'',(done) => {
      request
        .get('/users/1')
        .end((err, res) => {
          if(!err) {
            res.should.have.status(200);
            res.body.status.should.be.eql('success');
          } else {
            console.log('err', err);
          }
          done();
        });
    });

    it('A user should recieve \'User not found\' for unknown userid ',
    (done) => {
      request
      .get('/users/-2')
      .end((err, res) => {
        if(!err) {
          // test response
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('User not found.');
        } else {
          console.log('err', err);
        }
        done();
      });
    });
  });
  
})

