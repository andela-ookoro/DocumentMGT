import reducer from '../../reducers/role';
import { ROLES } from '../../actions/actionTypes';
import mockData from '../../../server/tests/mockData';

describe('loginFailed reducer', () => {
  const action = {
    type: ROLES,
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

