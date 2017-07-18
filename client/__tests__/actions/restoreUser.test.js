import axios from 'axios';
import { MESSAGE } from '../../actions/actionTypes';
import restoreUser from '../../actions/restoreUser';
import mockData from '../../../server/tests/mockData';

const mockDocument = mockData.document;
const successMessage = 'User has been restored successfully';
const resolveData = {
  data: {
    status: 'success',
    message: successMessage
  }
};

const expectedAction = {
  type: MESSAGE,
  message: {
    from: 'restoreUser',
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
axios.post = jest.fn(url => mockResponse);

describe('restoreUser action', () => {
  it('should make a delete request to a route "/api/v1/users/restore/<userId>"',
  () => {
    restoreUser(1);
    const requestData = {
      status: "active"
    };
    expect(axios.post).toBeCalledWith('/api/v1/users/restore/1', requestData);
  });

  it('should return an action with type "MESSAGE"',
  () => {
    restoreUser(1)
    .then(response =>
      expect(response).toEqual(expectedAction)
    );
  });

  it('should return an error message when error is reported from server',
  () => {
    // return an error
    axios.post = jest.fn(url => mockError);
    restoreUser(1)
    .then((response) => {
      // update "expectedAction" value to reflect new expected action
      expectedAction.message.info = mockData.errorMessage;
      expect(response).toEqual(expectedAction);
    });
  });
});




