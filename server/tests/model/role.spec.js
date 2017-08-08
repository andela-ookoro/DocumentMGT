/* eslint no-unused-expressions: "off"*/

import expect from 'expect';
import model from '../../models';
import mockData from '../mockData';

const Role = model.role;
const mockRole = mockData.role;

describe('Role Model', () => {
  let role;
  describe('Create Role', () => {
    it('should create new role', (done) => {
      Role.create(mockRole)
        .then((createdRole) => {
          role = createdRole;
          expect(role).toExist('title');
          done();
        });
    });

    it('created role should exist', () => {
      expect(role).toExist();
      expect(role).toExist('title');
    });
  });

  describe('Role Validation', () => {
    it('requires title field to create a role', (done) => {
      Role.create()
        .catch((error) => {
          expect(/notNull Violation/.test(error.message)).toBeTruthy;
          done();
        });
    });
    it('ensure a role has a unique title', (done) => {
      Role.create(mockRole)
        .catch((error) => {
          expect(/SequelizeUniqueConstraintError/.test(error.name)).toBeTruthy;
          done();
        });
    });
  });
});
