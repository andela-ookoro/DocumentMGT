import reducer from '../../reducers/deleteDocument';
import * as types from '../../actions/actionTypes';
import mockData from '../../../server/__test__/mockData';

const action = {
  type: types.DELETE_DOCUMENT,
  status: mockData.message,
  message: mockData.message,
  title: ''
};

describe('deleteDocument reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle "DELETE_DOCUMENTS"', () => {
    expect(
      reducer([], action)
    ).toEqual(action);
  });
});
