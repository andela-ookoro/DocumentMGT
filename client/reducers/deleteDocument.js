import * as types from '../actions/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case types.DELETE_DOCUMENT:
      return action;
    default:
      return state;
  }
};
