import axios from 'axios';
import { GET_DOCUMENTS, MESSAGE } from '../../actions/actionTypes'; 
import getDocuments from '../../actions/getDocuments';
import mockData from '../../../server/tests/mockData';

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
 type: GET_DOCUMENTS,
 status: 'success',
 document: [mockDocument],
 message: '',
 pageCount: 1
};

const errorMessage = {
  message: {
    from: "getDocuments",
    info: mockData.errorMessage
  },
  type: MESSAGE
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
  resolve(resolveData);
});

const mockError = new Promise((resolve, reject) => {
  throw error;
});

// mock axios methods 
axios.get = jest.fn((url) => mockResponse);

describe('getDocuments action', () => {
  it('should make a get request to a route "/api/v1/documents"', () => {
    getDocuments('private','love');
    expect(axios.get).toBeCalledWith('/api/v1/search/documents?accessRight=private&title=love&offset=0&limit=7');
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
      expect(response).toEqual(errorMessage);
    });
  });

});
