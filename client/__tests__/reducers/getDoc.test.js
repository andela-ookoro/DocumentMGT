import reducer from '../../reducers/getDocument';
import * as types from '../../actions/actionTypes';
import mockData from '../../../server/__test__/mockData';

const action = {
  type: types.GET_DOCUMENT,
  status: mockData.message,
  message: mockData.message,
  document: mockData.document
};

describe('getDocument reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle "GET_DOCUMENT"', () => {
    expect(
      reducer([], action)
    ).toEqual(action);
  });
});
