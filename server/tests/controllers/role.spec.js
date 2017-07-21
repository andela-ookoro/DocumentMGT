import chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import faker from 'faker';

import app from '../../../server';
import mockdata from '../mockData';
import model from '../../models/index';

const Role = model.role;
const User = model.user;
const should = chai.should();
const request = supertest.agent(app);
chai.use(chaiHttp);

const role = mockdata.role;
const mockUser = {
  fname: faker.name.firstName(),
  lname: faker.name.lastName(),
  mname: faker.name.firstName(),
  password: '!smilesh2o',
  email: faker.internet.email(),
  roleId: 3
};
const roleWithoutTitle = mockdata.roleWithoutTitle;
const registeredRole = {};
let adminUserId;

describe('/api/v1/role ', () => {
  // cache jwt and userinfo
  let jwt;

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
              adminUserId = res.body.userInfo.id;
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

  describe('POST /api/v1/roles ', () => {
    it('As a user , I should be able to create a role', (done) => {
      request
        .post('/api/v1/roles')
        .send(role)
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            // store new Role for futher testing
            registeredRole.title = res.body.role.title;
            registeredRole.id = res.body.role.id;
            res.should.have.status(201);
            res.body.role.title.should.be.eql(role.title);
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
            res.body.roles.should.be.an('array');
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

  describe('PUT /api/v1/roles/:id ', () => {
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

