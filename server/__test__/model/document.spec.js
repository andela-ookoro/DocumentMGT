/* eslint no-unused-expressions: "off"*/

import expect from 'expect';
import model from '../../models';
import mockData from '../mockData';

const Document = model.document;
const AccessRight = model.accessRight;
const User = model.user;

// mock data
const mockUser = mockData.user;
const mockAccessRight = mockData.accessRight;
const mockDocument = mockData.document;

describe('Document Model', () => {
  let document;

  describe('Create document', () => {
    expect(2).toBe(2);
    it('should create new dcument', (done) => {
      Document.create(mockDocument)
        .then((newDocument) => {
          console.log('newDocument', newDocument);
          document = newDocument;
          expect(document).toExist('title');
          done();
        })
        .catch((err) => {
          console.log('error newDocument', err);
        });
    });

    it('created document should exist', () => {
      expect(document).toExist();
      expect(document).toExist('title');
    });
  });

  describe('Document Validation', () => {
    it('requires title field to create a document', (done) => {
      Document.create(mockData.DocumentWithoutTitle)
        .catch((error) => {
          console.log('h20', error.message);
          expect(/notNull Violation/.test(error.message)).toBeTruthy;
          done();
        });
    });

    it('requires body field to create a document', (done) => {
      Document.create(mockData.DocumentWithoutBody)
        .catch((error) => {
          expect(/notNull Violation/.test(error.message)).toBeTruthy;
          done();
        });
    });
  });


  describe('Document\'s title  and body  Validation', () => {
    it('title  and body should contain at least two alphabet', () => {
      User.create(mockData.DocumentWithInvalidTitleBody)
        .catch((error) => {
          expect(/Validation error: Validation is {2}failed/
            .test(error.message)).toBeTruthy;
          expect(/SequelizeValidationError/.test(error.name)).toBeTruthy;
        });
    });
  });
});

