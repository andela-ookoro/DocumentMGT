import axios from 'axios';
import { MESSAGE, ROLES } from '../../actions/actionTypes'; 
import { getRoles } from '../../actions/roles';
import mockData from '../../../server/tests/mockData';

// mock axios post and get methods.
const mockRoles = mockData.role;

const resolveData = {
  data: {
    status: 'success',
    roles: [mockRoles]
  }
};

let expectedAction = {
  type: ROLES,
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
  it('should make a get request to a route "/api/v1/roles"', () => {
    getRoles();
    expect(axios.get).toBeCalledWith('/api/v1/roles');
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
      const errorMessage = response.message.info;
      expect(errorMessage).toEqual(mockData.errorMessage);
    });
  });
});
