import loginSuccessReducer from '../../reducers/login';
import * as types from '../../actions/actionTypes';
import mockData from '../../../server/tests/mockData';


describe('login reducer', () => {
  const action = {
    type: types.LOG_IN_SUCCESS,
    loginMessage: mockData.message
  };

  it('should return the initial state', () => {
    expect(loginSuccessReducer(undefined, {})).toEqual(false);
  });

  it('should handle "LOG_IN_SUCCESS"', () => {
    expect(
      loginSuccessReducer([], action)
    ).toEqual(false);
  });
});
