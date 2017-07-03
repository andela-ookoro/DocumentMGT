import reducer from '../../reducers/signup';
import * as types from '../../actions/actionTypes';

describe('loginFailed reducer', () => {
  const action = {
    type: types.SIGN_UP_SUCCESS
  };
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(false);
  });

  it('should handle "SIGN_UP_SUCCESS"', () => {
    expect(
      reducer([], action)
    ).toEqual(false);
  });
});
