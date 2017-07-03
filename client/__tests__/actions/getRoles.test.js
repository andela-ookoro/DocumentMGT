import axios from 'axios';
import * as types from '../../actions/actionTypes'; 
import { getRoles } from '../../actions/roles';
import mockData from '../../../server/__test__/mockData';

// mock axios post and get methods.
const mockRoles = mockData.role;

const resolveData = {
  data: {
    status: 'success',
    data: [mockRoles]
  }
};

let expectedAction = {
  type: types.ROLES_LOADED,
  roles: [mockRoles]
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

describe('getRoles action', () => {
  it('should make a get request to a route "/roles"', () => {
    getRoles();
    expect(axios.get).toBeCalledWith('/roles');
  });

  it(`should return an action with type "ROLES_LOADED" on successful server response`,
  () => {
    getRoles()
    .then(response => 
      expect(response).toEqual(expectedAction)
    );
  });

  it('should return an error message when error is reported from server',
  () => {
    axios.get = jest.fn((url) => mockError);
    getRoles()
    .then(response => {
      // update "expectedAction" value to reflect new expected action
      expectedAction = {
        type: types.ROLES_LOAD_FAILED,
        roleLooadError: mockData.errorMessage
      };
      expect(response).toEqual(expectedAction);
    });
  });

});
