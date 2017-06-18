

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
let role =  mockdata.role;
let roleWithTitle = mockdata.roleWithTitle; 
let registeredRole= {};

describe('/document ', () => {
  describe('POST /document ', () => {
    it('As a user , I should be able to create a role',(done) => {
      request
        .post('/roles')
        .send(role)
        .end((err, res) => {
          if(!err) {
            // store new Role for futher testing
            console.log(res.body);
            registeredRole.title = res.body.data.title;
            registeredRole.id = res.body.data.id;
            res.should.have.status(201);
            res.body.data.title.should.be.eql(role.title);
            res.body.status.should.be.eql('success');
          }
          done();
        });
    });
   it('A user should recieve a message when compulsory fields are not provided',
    (done) => {
      request
        .post('/roles')
        .send(roleWithTitle)
        .end((err, res) => {
          if(res) {
            res.should.have.status(500);
            res.body.status.should.be.eql('fail');
            res.body.message.should.be.eql('Role title is compulsory.');
          }
          done();
        });
    });
  });

  describe('GET /roles ', () => {
    it('A user should recieve a list of roles',
    (done) => {
      request
        .get('/roles')
        .end((err, res) => {
          if(!err) {
            res.should.have.status(200);
            res.body.status.should.be.eql('success');
            res.body.data.should.be.an('array');
          }
          done();
        });
    });
  });

    describe('GET /roles/:id ', () => {
    it('A user should get a role by id \'when id exist\'',(done) => {
      request
        .get(`/roles/${ registeredRole.id}`)
        .end((err, res) => {
          if(!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist 
            if(!res.body.message) {
              res.body.status.should.be.eql('success');
            } else {
              res.body.message.should.be.eql('Role not found.');
            }
          } 
          done();
        });
    });

    it('A user should recieve \'Role not found\' for unknown roleid ',
    (done) => {
      request
      .get('/roles/-2')
      .end((err, res) => {
        if(!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Role not found.');
        } 
        done();
      });
    });
  });
});

