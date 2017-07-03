import axios from 'axios';
import * as types from '../../actions/actionTypes';
import getDocument from '../../actions/getDocument';
import mockData from '../../../server/__test__/mockData';

// mock axios post and get methods.
const mockDocument = mockData.document;

const resolveData = {
  data: {
    status: 'success',
    data: mockDocument
  }
};

const expectedAction = {
  type: types.GET_DOCUMENT,
  status: 'success',
  document: mockDocument,
  message: ''
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
  resolve(resolveData);
});

const mockError = new Promise((resolve, reject) => {
  throw error;
});

// mock axios methods
axios.get = jest.fn(url => mockResponse);

describe('getDocument action', () => {
  it('should make a get request to a route "/documents/<documentId>"', () => {
    getDocument(1);
    expect(axios.get).toBeCalledWith('/documents/1');
  });

  it('should return an action with type "GET_DOCUMENT"',
  () => {
    getDocument(1)
    .then(response =>
      expect(response).toEqual(expectedAction)
    );
  });

  it('should return an error message when error is reported from server',
  () => {
    axios.get = jest.fn(url => mockError);
    getDocument(1)
    .then((response) => {
      // update "expectedAction" value to reflect new expected action
      expectedAction.message = mockData.errorMessage;
      expectedAction.status = 'failed';
      expectedAction.document = {};
      expect(response).toEqual(expectedAction);
    });
  });
});

