/* eslint no-unused-expressions: "off"*/

import expect from 'expect';
import model from '../../models';
import mockData from '../mockData';

const User = model.user;
const badUser = mockData.badUser;
const mockUser = mockData.user;

describe('User Model', () => {
  let user;
  describe('Create User', () => {
    it('should create new user', (done) => {
      User.create(mockUser)
        .then((newuser) => {
          user = newuser;
          expect(user).toExist('fname');
          done();
        })
        .catch((err) => {
          console.log('error', err);
        });
    });

    it('created role should exist', () => {
      expect(user).toExist();
      expect(user).toExist('fname');
    });

    it('should create a user with hashed password', () => {
      expect(user.password).toNotEqual(mockUser.password);
    });
  });

  describe('User Validation', () => {
    it('requires fname field to create a user', (done) => {
      User.create(mockData.UserWithoutFirstname)
        .catch((error) => {
          expect(/notNull Violation/.test(error.message)).toBeTruthy;
          done();
        });
    });

    it('requires lname field to create a user', (done) => {
      User.create(mockData.UserWithoutlastname)
        .catch((error) => {
          expect(/notNull Violation/.test(error.message)).toBeTruthy;
          done();
        });
    });

    it('requires email field to create a user', (done) => {
      User.create(mockData.UserWithoutEmail)
        .catch((error) => {
          expect(/notNull Violation/.test(error.message)).toBeTruthy;
          done();
        });
    });

    it('ensure a user has a unique email', (done) => {
      User.create(mockUser)
        .catch((error) => {
          expect(/SequelizeUniqueConstraintError/.test(error.name)).toBeTruthy;
          done();
        });
    });
  });

  describe('Email Validation', () => {
    it('requires user mail to be in proper email format', () => {
      User.create(mockData.UserWithInvalidEmail)
        .catch((error) => {
          expect(/Validation error: Validation isEmail failed/
            .test(error.message)).toBeTruthy;
          expect(/SequelizeValidationError/.test(error.name)).toBeTruthy;
        });
    });
  });

  describe('First and Last name Validation', () => {
    it('first and last name should contain at least two alphabet', () => {
      User.create(mockData.UserWithInvalidName)
        .catch((error) => {
          expect(/Validation error: Validation is {2}failed/
            .test(error.message)).toBeTruthy;
          expect(/SequelizeValidationError/.test(error.name)).toBeTruthy;
        });
    });
  });
});

