import loginFailedReducer from '../../reducers/login';
import loginSuccessReducer from '../../reducers/session';
import * as types from '../../actions/actionTypes';
import mockData from '../../../server/__test__/mockData';

describe('loginFailed reducer', () => {
  const action = {
    type: types.LOG_FAILED,
    loginMessage: mockData.message
  };
  it('should return the initial state', () => {
    expect(loginFailedReducer(undefined, {})).toEqual('');
  });

  it('should handle "LOG_FAILED"', () => {
    expect(
      loginFailedReducer([], action)
    ).toEqual(action.loginMessage);
  });
});

describe('loginSuccess reducer', () => {
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
