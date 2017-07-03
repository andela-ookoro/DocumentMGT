import reducer from '../../reducers/createDoc';
import * as types from '../../actions/actionTypes';
import mockData from '../../../server/__test__/mockData';

const action = {
  type: types.CREATE_DOCUMENT_STATUS,
  status: mockData.message,
  message: mockData.message,
  title: ''
};

const expectedResult = {
  title: '',
  status: action.status
};

describe('createDoc reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle CREATE_DOCUMENT_STATUS', () => {
    expect(
      reducer([], action)
    ).toEqual(expectedResult);
  });
});
