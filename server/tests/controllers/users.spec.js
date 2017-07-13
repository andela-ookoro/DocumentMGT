

// Require the dev-dependencies
import  chai from 'chai';
import chaiHttp from 'chai-http';
const should = chai.should();

import app from '../../../server';

import supertest from 'supertest';
const request = supertest.agent(app);
chai.use(chaiHttp);


// import mockdata
import mockdata from '../mockData';
let user = mockdata.user;
let secondUser = mockdata.user;
const registeredUser = {};

describe('/api/v1/users ', () => {
  // cache jwt and userinfo
  let jwt;
  let testUser;

  // create user to own the request
  before((done) => {
    request
    .post('/api/v1/users')
    .send(user)
    .end((err, res) => {
      if (!err) {
        jwt = res.body.jwtToken;
        // store registered user for futher testing
        registeredUser.email = user.email;
        registeredUser.password = user.password;
        registeredUser.id = res.body.id;
        console.log('registeredUser.........................',res.body, registeredUser);
        done();
      }
    });
  });

  describe('POST /api/v1/users ', () => {
    it('A user should recieve a jwt token, user metadata and a status ' +
    'after successful signup',
    (done) => {
      secondUser.email = `u${secondUser.email}`;
      request
        .post('/api/v1/users')
        .send(secondUser)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(201);
            res.body.userInfo.email.should.be.eql(secondUser.email);
            res.body.status.should.be.eql('success');
          }
          done();
        });
    });

    it('A user should recieve a message when compulsory fields are not give',
    (done) => {
      user = mockdata.UserWithoutFirstname;
      request
        .post('/api/v1/users')
        .send(user)
        .end((err, res) => {
          if (res) {
            res.should.have.status(400);
            res.body.status.should.be.eql('fail');
            res.body.message.should.be.eql('First name, last name, email, role'
             + '  and password are compulsory.');
          }
          done();
        });
    });
  });

  describe('GET /api/v1/users/login ', () => {
    it('A user should recieve a jwt token, user metadata and a status ' +
    'after successful login',
    (done) => {
      request
        .post('/api/v1/users/login')
        .send(registeredUser)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            res.body.userInfo.email.should.be.eql(registeredUser.email);
            res.body.status.should.be.eql('success');
          }
          done();
        });
    });

    it('A user should recieve a message after unsuccessful login',
    (done) => {
      registeredUser.password += 'wrong';
      request
        .post('/api/v1/users/login')
        .send(registeredUser)
        .end((err, res) => {
          if (!err) {
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
        .post('/api/v1/users/login')
        .send(registeredUser)
        .end((err, res) => {
          if (res) {
            res.should.have.status(500);
            res.body.status.should.be.eql('fail');
            res.body.message.should.be.eql('Email and password are compulsory.');
          }
          done();
        });
    });
  });

  describe('GET /api/v1/users ', () => {
    it('A user should recieve a list of all users when no query is passed',
    (done) => {
      request
        .get('/users')
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            // test response
            res.should.have.status(200);
            res.body.status.should.be.eql('success');
          }
          done();
        });
    });

    it('A user should recieve a limited list of users starting from an index',
   (done) => {
     request
        .get('/api/v1/users?offset=2&limit=5')
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            // test response
            res.should.have.status(200);
            res.body.status.should.be.eql('success');
          }
          done();
        });
   });
  });

  describe('GET /api/v1/users/:id ', () => {
    it('A user should get a user by id \'when id exist\'', (done) => {
      request
        .get(`/api/v1/users/${registeredUser.id}`)
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist
            if (!res.body.message) {
              res.body.status.should.be.eql('success');
            } else {
              res.body.message.should.be.eql('User not found.');
            }
          }
          done();
        });
    });

    it('A user should recieve \'User not found\' for unknown userid ',
    (done) => {
      request
      .get('/api/v1/users/-2')
      .set('Authorization', jwt)
      .end((err, res) => {
        if (!err) {
          // test response
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('User not found.');
        }
        done();
      });
    });
  });

  describe('PUT /api/v1/users/:id ', () => {
    it('A user should update a user by id \'when id exist\'', (done) => {
      request
        .put(`/api/v1/users/${registeredUser.id}`)
        .set('Authorization', jwt)
        .send(mockdata.updateuser)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist
            if (!res.body.message) {
              res.body.status.should.be.eql('success');
            } else {
              res.body.message.should.be.eql('User not found.');
            }
          }
          done();
        });
    });

    it('A user should recieve \'User not found\' for unknown userid ',
    (done) => {
      request
      .put('/api/v1/users/-2')
      .set('Authorization', jwt)
      .send(mockdata.user)
      .end((err, res) => {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('User not found.');
        }
        done();
      });
    });
  });


  describe('GET /api/v1/search/users/?q={} ', () => {
    it('A user should get list of  user with a list of attributes', (done) => {
      request
        .get('/api/v1/search/users?fname=Cullen&lname=Luettgen')
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist
            if (!res.body.message) {
              res.body.status.should.be.eql('success');
              res.body.data.should.be.an('array');
            } else {
              res.body.status.should.be.eql('No user found.');
            }
          }
          done();
        });
    });
  });

  describe('GET /api/v1/users/:userId/documents ', () => {
    it('A user should get a documents belonging to a user by userid ' +
      '\'when id exist\'', (done) => {
      request
        .get(`/api/v1/users/${registeredUser.id}/documents`)
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist
            if (!res.body.message) {
              res.body.status.should.be.eql('success');
            } else {
              res.body.message.should.be.eql('User not found.');
            }
          }
          done();
        });
    });

    it('A user should recieve \'User not found\' for unknown userid ',
    (done) => {
      request
      .get('/api/v1/users/-2/documents')
      .set('Authorization', jwt)
      .end((err, res) => {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('User not found.');
        }
        done();
      });
    });
  });

  describe('DETELE /api/v1/users/:id ', () => {
    it('A user can delete a user by id \'when id exist\'', (done) => {
      request
        .delete(`/api/v1/users/${registeredUser.id}`)
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist
            if (!res.body.message) {
              res.body.status.should.be.eql('success');
            } else {
              res.body.message.should.be.eql('User not found.');
            }
          }
          done();
        });
    });

    it('A user should recieve \'User not found\' for unknown userid ',
    (done) => {
      request
      .delete(`/api/v1/users/${registeredUser.id}`)
      .set('Authorization', jwt)
      .end((err, res) => {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('User not found.');
        }
        done();
      });
    });
  });
});

