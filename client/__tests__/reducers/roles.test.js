import reducer from '../../reducers/role';
import * as types from '../../actions/actionTypes';
import mockData from '../../../server/__test__/mockData';

describe('loginFailed reducer', () => {
  const action = {
    type: types.ROLES_LOADED,
    roles: [mockData.role]
  };
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle "ROLES_LOADED"', () => {
    expect(
      reducer([], action)
    ).toEqual(action.roles);
  });
});

