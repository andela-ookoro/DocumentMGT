// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest'
import faker from 'faker';
import app from '../../../server';
// import mockdata
import mockdata from '../mockData';

const Role = model.role;
const User = model.user;

const should = chai.should();
const request = supertest.agent(app);
chai.use(chaiHttp);

let user = {
  fname: 'Dele',
  lname: 'Musa',
  mname: 'Ngozi',
  password: '!smilesh2o',
  email: faker.internet.email(),
  roleId: 3
};
let secondUser = mockdata.user;
let regulerUser = {};
let adminUser = {};

describe('/api/v1/users ', () => {
  // cache jwt and userinfo
  let jwt;
  let testUser;

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
        user.isAdmin = true;
        const wasCreated = created;
         // create admin account
        // set user role to admin
        user.roleId = adminRoleId;
        request
          .post('/api/v1/users')
          .send(user)
          .end((err, res) => {
            if (!err) {
              jwt = res.body.jwtToken;
              // store registered user for futher testing
              adminUser.email = user.email;
              adminUser.password = user.password;
              adminUser.id = res.body.userInfo.id;
              done();
            }
          });
      });
  });
 
  // delete user after test
  after((done) => {
    const id = [adminUser.id, regulerUser.id]
    User.destroy({ 
      where: { 
        id 
      }
    });
    done();
  });

  describe('POST /api/v1/users', () => {
    it('A user should recieve a jwt token, user metadata and a status ' +
    'after successful signup',
    (done) => {
      secondUser.email = `u${secondUser.email}`;
      secondUser.roleId = 1;
      request
        .post('/api/v1/users')
        .send(secondUser)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(201);
            res.body.status.should.be.eql('success');
            // save regular user credentials
            regulerUser = {
              email: secondUser.email,
              password: secondUser.password,
              id: res.body.userInfo.id,
              jwt: res.body.jwtToken
            };
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


  describe('POSt /api/v1/users/login ', () => {
    it('A user should recieve a jwt token, user metadata and a status ' +
    'after successful login',
    (done) => {
      request
        .post('/api/v1/users/login')
        .send(adminUser)
        .end((err, res) => {
          if (!err) {
            res.body.status.should.be.eql('success');
          }
          done();
        });
    });

    it('A user should recieve a message after unsuccessful login',
    (done) => {
      adminUser.password += 'wrong';
      request
        .post('/api/v1/users/login')
        .send(adminUser)
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
      adminUser.password = '';
      request
        .post('/api/v1/users/login')
        .send(adminUser)
        .end((err, res) => {
          if (res) {
            res.should.have.status(401);
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
        .get('/api/v1/users')
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
        .get(`/api/v1/users/${adminUser.id}`)
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist
            if (!res.body.message) {
              res.body.status.should.be.eql('success');
            } else {
              res.body.message.should.be.eql('User was not found.');
            }
          }
          done();
        });
    });

    it('A user should recieve \'User was not found\' for unknown userid ',
    (done) => {
      request
      .get('/api/v1/users/-2')
      .set('Authorization', jwt)
      .end((err, res) => {
        if (!err) {
          // test response
          res.should.have.status(404);
          res.body.message.should.be.eql('User was not found.');
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
              res.body.users.rows.should.be.an('array');
            } else {
              res.body.status.should.be.eql('fail');
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
        .get(`/api/v1/users/${adminUser.id}/documents`)
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist
            if (!res.body.message) {
              res.body.status.should.be.eql('success');
            } else {
              res.body.message.should.be.eql('User was not found.');
            }
          }
          done();
        });
    });

    it('A user should recieve \'User was not found\' for unknown userid ',
    (done) => {
      request
      .get('/api/v1/users/-2/documents')
      .set('Authorization', jwt)
      .end((err, res) => {
        if (!err) {
          res.should.have.status(200);
          res.body.status.should.be.eql('fail');
          res.body.message.should.be.eql('User was not found.');
        }
        done();
      });
    });
  });

 describe('PUT /api/v1/users/:id ', () => {
  let update = {
      curPassword: '!smilesh2o',
      fname: 'testinknknkkng'
    }
  it('A user should update a user by id \'when id exist\'', (done) => {
    request
      .put(`/api/v1/users/${adminUser.id}`)
      .set('Authorization', jwt)
      .send(update)
      .end((err, res) => {
        if (!err) {
          res.should.have.status(200);
          // if there is no error, that is user exist
          if (!res.body.message) {
            res.body.status.should.be.eql('success');
          } else {
            res.body.message.should.be.eql('User was not found.');
          }
        }
        done();
      });
  });

  it('A user should recieve \'user was not found\' for unknown userid ',
  (done) => {
    request
    .put('/api/v1/users/-2')
    .set('Authorization', jwt)
    .send(update)
    .end((err, res) => {
      if (!err) {
        res.should.have.status(200);
        res.body.status.should.be.eql('fail');
        res.body.message.should.be.eql('User was not found');
      }
      done();
    });
  });
});

  describe('DETELE /api/v1/users/:id ', () => {
    const message = 'This account is blocked, Please account the admin';

    it('An admin should recieve \'User was not found\' for unknown userid ',
    (done) => {
      request
      .delete(`/api/v1/users/-2`)
      .set('Authorization', jwt)
      .end((err, res) => {
        if (!err) {
          res.should.have.status(200);
          res.body.message.should.be.eql('User was not found.');
        }
        done();
      });
    });

    it('An admin should recieve \'Invalid user ID\' for non numeric userid',
     (done) => {
      request
      .delete(`/api/v1/users/a`)
      .set('Authorization', jwt)
      .end((err, res) => {
        if (!err) {
          res.should.have.status(400);
          res.body.message.should.be.eql('Invalid user ID');
        }
        done();
      });
    });

    it('An admin can delete a user by id \'when id exist\'', (done) => {
      request
        .delete(`/api/v1/users/${regulerUser.id}`)
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist
            if (!res.body.message) {
              res.body.status.should.be.eql('success');
            } else {
              res.body.message.should.be
              .eql('User has been blocked successfully');
            }
          }
          done();
        });
    });

    it(`A blocked user should recieve text ${message}`, (done) => {
      request
      .delete(`/api/v1/users/${regulerUser.id}`)
      .set('Authorization', regulerUser.jwt)
      .end((err, res) => {
        if (!err) {
          res.should.have.status(401);
          res.body.message
          .should.be.eql('This account is blocked, Please contact the admin');
        }
        done();
      });
    });
  });

  describe('POST /users/restore/:id ', () => {
    const message = 'This account is blocked, Please account the admin';

    it('An admin should recieve \'User was not found\' for unknown userid ',
    (done) => {
      request
      .post(`/api/v1/users/restore/-2`)
      .set('Authorization', jwt)
      .end((err, res) => {
        if (!err) {
          res.should.have.status(200);
          res.body.message.should.be.eql('User was not found.');
        }
        done();
      });
    });

    it('An admin should recieve \'Invalid user ID\' for non numeric userid',
     (done) => {
      request
      .post(`/api/v1/users/restore/a`)
      .set('Authorization', jwt)
      .end((err, res) => {
        if (!err) {
          res.should.have.status(400);
          res.body.message.should.be.eql('Invalid user ID');
        }
        done();
      });
    });

    it('An admin can restore a user by id \'when id exist\'', (done) => {
      request
        .post(`/api/v1/users/restore/${regulerUser.id}`)
        .set('Authorization', jwt)
        .end((err, res) => {
          if (!err) {
            res.should.have.status(200);
            // if there is no error, that is user exist
            if (!res.body.message) {
              res.body.status.should.be.eql('success');
            } else {
              res.body.message.should.be.eql('User was not found.');
            }
          }
          done();
        });
    });
  });
});

