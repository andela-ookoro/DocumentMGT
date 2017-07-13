import chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';


import app from '../../../server';
// import mockdata
import mockdata from '../mockData';

const should = chai.should();


const request = supertest.agent(app);
chai.use(chaiHttp);



const role = mockdata.role;
const mockUser = mockdata.user;
const roleWithoutTitle = mockdata.roleWithoutTitle;
const registeredRole = {};

describe('/api/v1/document ', () => {
  // cache jwt and userinfo
  let jwt;

  // create user to own the request
  before((done) => {
    request
    .post('/api/v1/users')
    .send(mockUser)
    .end((err, res) => {
      if (!err) {
        jwt = res.body.jwtToken;
        done();
      } else {
        console.log('.................,', err);
        done();
      }
    });
  });

  // delete user after test
  after((done) => {
    request
    .delete('/api/v1/users/1')
    .set('Authorization', jwt)
    .end((err, res) => {
      if (!err) {
        done();
      }
    })
    .catch((error) => {
      console.log('.................,', error);
      done();
    });
  });

  describe('POST /api/v1/document ', () => {
    it('As a user , I should be able to create a role', (done) => {
      request
        .post('/api/v1/roles')
        .send(role)
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            // store new Role for futher testing
            registeredRole.title = res.body.data.title;
            registeredRole.id = res.body.data.id;
            res.should.have.status(201);
            res.body.data.title.should.be.eql(role.title);
            res.body.status.should.be.eql('success');
          }
          done();
        });
    });
    it('A user should recieve a message when compulsory' +
      'fields are not provided',
    (done) => {
      request
        .post('/api/v1/roles')
        .set('Authorization', jwt)
        .send(roleWithoutTitle)
        .end((err, res) => {
          if (res) {
            res.should.have.status(500);
            res.body.status.should.be.eql('fail');
            res.body.message.should.be.eql('Role title is compulsory.');
          }
          done();
        });
    });
  });

  describe('GET /api/v1/roles ', () => {
    it('A user should recieve a list of roles',
    (done) => {
      request
        .get('/api/v1/roles')
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            res.body.status.should.be.eql('success');
            res.body.data.should.be.an('array');
          }
          done();
        });
    });
  });

  describe('GET /api/v1/roles/:id ', () => {
    it('A user should get a role by id \'when id exist\'', (done) => {
      request
        .get(`/api/v1/roles/${registeredRole.id}`)
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist
            if (!res.body.message) {
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
      .get('/api/v1/roles/-2')
      .set('Authorization', jwt)
      .end((err, res) => {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Role not found.');
        }
        done();
      });
    });
  });

  describe('PUT /api/v1/documents/:id ', () => {
    const updateRole = mockdata.updateRole;

    it('A user should update a role by id \'when role exist\'',
    (done) => {
      request
        .put(`/api/v1/roles/${registeredRole.id}`)
        .set('Authorization', jwt)
        .send(updateRole)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist
            if (!res.body.message) {
              res.body.status.should.be.eql('success');
              // res.body.data;
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
      .put('/api/v1/roles/-2')
      .set('Authorization', jwt)
      .send(mockdata.updatedocument)
      .end((err, res) => {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Role not found.');
        }
        done();
      });
    });
  });

  describe('DETELE /api/v1/roles/:id ', () => {
    it('A user can delete a role by id \'when id exist\'', (done) => {
      request
        .delete(`/api/v1/roles/${registeredRole.id}`)
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist
            if (!res.body.message) {
              res.body.status.should.be.eql('success');
            } else {
              res.body.message.should.be.eql('Role not found.');
            }
          }
          done();
        });
    });

    it('A user should recieve \'Role not found\' for unknown userid ',
    (done) => {
      request
      .delete('/api/v1/roles/-2')
      .set('Authorization', jwt)
      .end((err, res) => {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Role not found.');
        }
        done();
      });
    });
  });

  describe('GET /api/v1/roles/:id/users ', () => {
    it('A user should get list of users belonging to a role by roleid ' +
      '\'when id exist\'', (done) => {
      request
        .get('/api/v1/roles/3/users')
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist
            if (!res.body.message) {
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
      .get('/api/v1/roles/-2/users')
      .set('Authorization', jwt)
      .end((err, res) => {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('Role not found.');
        }
        done();
      });
    });
  });
});

