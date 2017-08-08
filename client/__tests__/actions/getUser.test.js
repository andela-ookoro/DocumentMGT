import axios from 'axios';
import { MESSAGE, GET_USER }  from '../../actions/actionTypes';
import getUser from '../../actions/getUser';
import mockData from '../../../server/tests/mockData';

// mock axios post and get methods.
const mockUser = mockData.user;

const resolveData = {
  data: {
    status: 'success',
    user: mockUser
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
  resolve(resolveData);
});

const mockError = new Promise((resolve, reject) => {
  throw error;
});

// mock axios methods
axios.get = jest.fn(url => mockResponse);

describe('getUser action', () => {
  it('should make a get request to a route "/api/v1/users/<documentId>"',
  () => {
    getUser(1);
    expect(axios.get).toBeCalledWith('/api/v1/users/1');
  });

  it('should return an action with type "GET_USER"',
  () => {
    getUser(1)
    .then(response => {
      const responseUser = response.user.email;
      expect(responseUser).toEqual(mockUser.email)
    });
  });

  it('should return an error message when error is reported from server',
  () => {
    axios.get = jest.fn(url => mockError);
    getUser(1)
    .then((response) => {
      const errorMessage = response.message.info;
      expect(errorMessage).toEqual(mockData.errorMessage);
    });
  });
});

