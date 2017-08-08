import reducer from '../../reducers/getUser';
import { GET_USER } from '../../actions/actionTypes';
import mockData from '../../../server/tests/mockData';

const action = {
  type: GET_USER,
  status: mockData.message,
  message: mockData.message,
  user: mockData.user
};

describe('getUser reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle "getUser"', () => {
    expect(
      reducer([], action)
    ).toEqual(action.user);
  });
});
