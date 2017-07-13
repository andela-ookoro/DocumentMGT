/* eslint no-unused-expressions: "off"*/

import expect from 'expect';
import model from '../../models';
import mockData from '../mockData';

const Document = model.document;
const User = model.user;


// mock data
let mockUser = mockData.user;
const mockDocument = mockData.document;

describe('Document Model', () => {
  let document;
   // create user to own the request
  before((done) => {
    User.create(mockUser)
    .then((newuser) => {
      mockUser = newuser;
      // set document author and owner
      mockDocument.owner = newuser.id;
      mockDocument.author = newuser.fname;
      done();
    })
    .catch(() => {
      done();
    });
  });

  describe('Create document', () => {
    it('should create new dcument', (done) => {
      Document.create(mockDocument)
        .then((newDocument) => {
          document = newDocument;
          expect(document).toExist('title');
          done();
        })
        .catch((error) => {
          console.log('....................', error);
          done();
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

