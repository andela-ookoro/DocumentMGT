import * as types from '../actions/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case types.GET_DOCUMENTS:
     return action
    default:
     return state;
  }
};