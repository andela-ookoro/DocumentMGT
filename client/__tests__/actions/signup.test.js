import axios from 'axios';
import * as types from '../../actions/actionTypes'; 
import { signup } from '../../actions/signup';
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
  type: types.SIGNUP_IN_SUCCESS
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
  it('should make a "post" request to a route "/users"', () => {
    signup(mockUser);
    expect(axios.post).toBeCalledWith('/users', mockUser);
  });

  it(`should return an action with type "SIGNUP_IN_SUCCESS" on successful signup`,
  () => {
    signup(mockUser)
    .then(response => 
      expect(response).toEqual(expectedAction)
    );
  });

  it('should return an action with type "SIGNUP_FAILED" on unsuccessful signup',
  () => {
    axios.post = jest.fn((url) => mockError);
    signup(mockUser)
    .then(response => {
      // update "expectedAction" value to reflect new expected action
      expectedAction = {
        type: types.SIGNUP_FAILED,
        signupMessage: mockData.errorMessage
      };
      expect(response).toEqual(expectedAction);
    });
  });

});
