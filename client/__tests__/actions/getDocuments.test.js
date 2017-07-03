import axios from 'axios';
import * as types from '../../actions/actionTypes'; 
import getDocuments from '../../actions/getDocuments';
import mockData from '../../../server/__test__/mockData';

// mock axios post and get methods.
const mockDocument = mockData.document;

const resolveData = {
  data: {
    status: 'success',
    data: {
      rows: [mockDocument],
      count: 1
    } 
  }
};

const expectedAction = {
 type: types.GET_DOCUMENTS,
 status: 'success',
 document: [mockDocument],
 message: '',
 pageCount: 1
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
axios.get = jest.fn((url) => mockResponse);

describe('getDocuments action', () => {
  it('should make a get request to a route "/documents"', () => {
    getDocuments('private','love');
    expect(axios.get).toBeCalledWith('/search/documents?accessRight=private&title=love&offset=0&limit=7');
  });

  it(`should return an action with type "GET_DOCUMENT"`,
  () => {
    getDocuments('private','love')
    .then(response =>
      expect(response).toEqual(expectedAction)
    );
  });

  it('should return an error message when error is reported from server',
  () => {
    axios.get = jest.fn((url) => mockError);
    getDocuments('private','love')
    .then(response => {
      // update "expectedAction" value to reflect new expected action
      expectedAction.message = mockData.errorMessage;
      expectedAction.status = 'failed';
      expectedAction.document = [];
      expectedAction.pageCount = 0;
      expect(response).toEqual(expectedAction);
    });
  });

});
