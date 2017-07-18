import axios from 'axios';
import { MESSAGE, SIGNUP_IN_SUCCESS }from '../../actions/actionTypes'; 
import { signup } from '../../actions/signup';
import mockData from '../../../server/tests/mockData';

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
  type: SIGNUP_IN_SUCCESS
};

const errorAction = {
  messag: {
    from: "signup",
    info: mockData.errorMessage
  },
 type: MESSAGE
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
  it('should make a "post" request to a route "/api/v1/users"', () => {
    signup(mockUser);
    expect(axios.post).toBeCalledWith('/api/v1/users', mockUser);
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
