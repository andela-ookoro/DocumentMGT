import axios from 'axios';
import * as types from '../../actions/actionTypes'; 
import { logIn } from '../../actions/login';
import mockData from '../../../server/__test__/mockData';

// mock axios post and get methods.
const mockUser = mockData.user;

const resolveData = {
  data: {
    status: 'success',
    data: {
      jwtToken : 'csfbfdddddddd',
      userInfo: mockUser
    }
  }
};

let expectedAction = {
  type: types.LOG_IN_SUCCESS
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
axios.post = jest.fn((url) => mockResponse);

describe('getRoles action', () => {
  it('should make a "post" request to a route "/users/login"', () => {
    logIn(mockUser);
    expect(axios.post).toBeCalledWith('/users/login', mockUser);
  });

  it(`should return an action with type "LOG_IN_SUCCESS" on successfull signin`,
  () => {
    logIn(mockUser)
    .then(response => 
      expect(response).toEqual(expectedAction)
    );
  });

  it('should return an action with type "SIGNUP_FAILED" on unsuccessful signin',
  () => {
    axios.post = jest.fn((url) => mockError);
    logIn(mockUser)
    .then(response => {
      // update "expectedAction" value to reflect new expected action
      expectedAction = {
        type: types.LOG_FAILED,
        loginMessage: mockData.errorMessage
      };
      expect(response).toEqual(expectedAction);
    });
  });

});
