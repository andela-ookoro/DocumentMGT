import axios from 'axios';
import { MESSAGE } from '../../actions/actionTypes';
import deleteDocument from '../../actions/deleteDocument';
import mockData from '../../../server/tests/mockData';

// mock axios post and get methods.
const mockDocument = mockData.document;

const resolveData = {
  status: 'success',
  message: mockDocument
};
const successMessage = 'document has been deleted successfully';
const expectedAction = {
  type: MESSAGE,
  message: {
    from: 'deleteDocument',
    info: successMessage
  }

};

const error = {
  response: {
    data: {
      status: 'fail',
      message: mockData.errorMessage
    }
  }
};

const mockResponse = new Promise((resolve, reject) => {
  resolve(mockDocument);
});

const mockError = new Promise((resolve, reject) => {
  throw error;
});

// mock axios methods
axios.delete = jest.fn(url => mockResponse);

describe('deleteDocument action', () => {
  it('should make a delete request with the documentId', () => {
    deleteDocument(1);
    expect(axios.delete).toBeCalledWith('/api/v1/documents/1');
  });

  it('should return the response from the server', () => {
    deleteDocument(1)
    .then((response) => {
      message = response.message.info;
      expect(message).toEqual(successMessage);
    });
  });

  it('should return an error message when an error is reported from server',
  () => {
    axios.delete = jest.fn(url => mockError);
    deleteDocument(mockData.document, 1)
    .then((response) => {
      message = response.message.info;
      expect(message).toEqual(mockData.errorMessage);
    });
  });

});
