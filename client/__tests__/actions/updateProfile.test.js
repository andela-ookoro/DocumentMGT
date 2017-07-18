import axios from 'axios';
import { MESSAGE } from '../../actions/actionTypes';
import updateProfile from '../../actions/updateProfile';
import mockData from '../../../server/tests/mockData';

const mockDocument = mockData.document;
let mockUser = mockData.user;
// set mockUser of the user to update
mockUser.userid = 1;
const successMessage = 'Profile has been successfully updated';
const resolveData = {
  data: {
    status: 'success',
    message: successMessage,
    jwtToken: 'jbsjsj sj j'
  }
};

const expectedAction = {
  type: MESSAGE,
  message: {
    from: 'profile',
    info: successMessage
  }
};

const error = {
  response: {
    status: 401,
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
axios.put = jest.fn(url => mockResponse);

describe('updateProfile action', () => {
  it('should make a delete request to a route "/api/v1/users/<userId>"',
  () => {
    updateProfile(mockUser);
    const requestData = {
      status: "active"
    };
    expect(axios.put).toBeCalledWith('/api/v1/users/1', mockUser);
  });

  it('should return an action with type "MESSAGE"',
  () => {
    updateProfile(mockUser)
    .then(response =>
      expect(response).toEqual(expectedAction)
    );
  });

  it('should return an error message when error is reported from server',
  () => {
    // return an error
    axios.put = jest.fn(url => mockError);
    updateProfile(mockUser)
    .then((response) => {
      // update "expectedAction" value to reflect new expected action
      expectedAction.message.info = mockData.errorMessage;
      expect(response).toEqual(expectedAction);
    });
  });
});

