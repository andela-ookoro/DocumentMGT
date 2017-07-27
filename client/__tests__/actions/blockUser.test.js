import axios from 'axios';
import { MESSAGE } from '../../actions/actionTypes';
import blockUser from '../../actions/blockUser';
import mockData from '../../../server/tests/mockData';

const mockDocument = mockData.document;

const resolveData = {
  data: {
    status: 'success',
    message: 'User has been blocked successfully'
  }
};

const expectedAction = {
  type: MESSAGE,
  message: {
    from: 'blockUser',
    info: 'User has been blocked successfully'
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
let message;
const mockResponse = new Promise((resolve, reject) => {
  resolve(resolveData);
});

const mockError = new Promise((resolve, reject) => {
  throw error;
});

// mock axios methods
axios.delete = jest.fn(url => mockResponse);

describe('blockUser action', () => {
  it('should make a delete request to a route "/api/v1/users/<userId>"',
  () => {
    blockUser(1);
    expect(axios.delete).toBeCalledWith('/api/v1/users/1');
  });

  it('should return an action with type "MESSAGE"',
  () => {
    blockUser(1)
    .then(respnse => {
      message = response.message.info;
      expect(message).toEqual('User has been blocked successfully');
    });
  });

  it('should return an error message when error is reported from server',
  () => {
    // return an error
    axios.delete = jest.fn(url => mockError);
    blockUser(1)
    .then((response) => {
      message = response.message.info;
      expect(message).toEqual(mockData.errorMessage);
    });
  });
});




