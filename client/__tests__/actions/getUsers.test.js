

import axios from 'axios';
import { GET_USERS, MESSAGE } from '../../actions/actionTypes'; 
import getUsers from '../../actions/getUsers';
import mockData from '../../../server/tests/mockData';

// mock axios post and get methods.
const mockUser = mockData.user;

const resolveData = {
  data: {
    status: 'success',
    data: {
      rows: [mockUser],
      count: 1
    } 
  }
};

const expectedAction = {
 type: GET_USERS,
 status: 'success',
 users: [mockUser],
 pageCount: 1
};

const errorMessage = {
  message: {
    from: "getUsers",
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

describe('getUsers action', () => {
  it('should make a get request to a route "/api/v1/documents"', () => {
    getUsers('blocked','dele');
    expect(axios.get).toBeCalledWith('/api/v1/Users?status=blocked&fname=dele&offset=0&limit=6');
  });

  it(`should return an action with type "GET_DOCUMENT"`,
  () => {
     getUsers('blocked','dele')
    .then(response =>
      expect(response).toEqual(expectedAction)
    );
  });

  it('should return an error message when error is reported from server',
  () => {
    axios.get = jest.fn((url) => mockError);
     getUsers('blocked','dele')
    .then(response => {
      expect(response).toEqual(errorMessage);
    });
  });

});


