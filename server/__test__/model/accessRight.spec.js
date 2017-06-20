/* eslint no-unused-expressions: "off"*/

import expect from 'expect';
import model from '../../models';
import mockData from '../mockData';

const AccessRight = model.accessRight;
const mockAccessRight = mockData.accessRight;

describe('AccessRight Model', () => {
  let accessRight;
  describe('Create AccessRight', () => {
    it('should create new accessRight', (done) => {
      AccessRight.create(mockAccessRight)
        .then((newAccessRight) => {
          accessRight = newAccessRight;
          expect(accessRight).toExist('title');
          done();
        })
        .catch((err) => {
          console.log('error', err);
        });
    });

    it('created accessRight should exist', () => {
      expect(accessRight).toExist();
      expect(accessRight).toExist('title');
    });
  });

  describe('AccessRight Validation', () => {
    it('requires title field to create a accessRight', (done) => {
      AccessRight.create()
        .catch((error) => {
          expect(/notNull Violation/.test(error.message)).toBeTruthy;
          done();
        });
    });
    it('ensure a accessRight has a unique title', (done) => {
      AccessRight.create(mockAccessRight)
        .catch((error) => {
          expect(/SequelizeUniqueConstraintError/.test(error.name)).toBeTruthy;
          done();
        });
    });
  });
});
