import axios from 'axios';
import * as types from '../../actions/actionTypes'; 
import { upsertDocument } from '../../actions/createDocument';
import mockData from '../../../server/__test__/mockData';

// mock axios post and get methods.
const mockDocument = mockData.document;
const resolveData = {
  status: 'success',
  data: mockDocument
};

const expectedAction = {
  type: types.CREATE_DOCUMENT_STATUS,
  status: 'success',
  message: mockDocument.title
}
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
axios.post = jest.fn((url) => mockResponse);

axios.put = jest.fn((url) => mockResponse);

describe('upsertDocument action', () => {
  it('should make a post request when the documentId is not provided',
  () => {
    upsertDocument(mockData.document, 0);
    expect(axios.post).toBeCalledWith('/documents', mockDocument);
  });

  it('should return an action with type "CREATE_DOCUMENT_STATUS" when the documentId is not provided',
  () => {
    upsertDocument(mockData.document, 0)
    .then(response =>
      expect(response).toEqual(expectedAction)
    )
  });

  it('should make a put request when the documentId is provided',
  () => {
    upsertDocument(mockData.document, 1);
    expect(axios.put).toBeCalledWith('/documents/1', mockDocument);
  });

  it('should return an action with type "CREATE_DOCUMENT_STATUS" when the documentId is not provided',
  () => {
    upsertDocument(mockData.document, 1)
    .then(response => 
      expect(response).toEqual(expectedAction)
    )
  });

  it('should return an error message when error is reported from server',
  () => {
    axios.put = jest.fn((url) => mockError);
    upsertDocument(mockData.document, 1)
    .then(response => {
      expectedAction.message = mockData.errorMessage;
      expect(response).toEqual(expectedAction);
    });
  });

});
