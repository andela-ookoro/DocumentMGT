import * as types from '../actions/actionTypes';

export default (state = { info: '', from: '' }, action) => {
  switch (action.type) {
    case types.MESSAGE:
      return action.message;
    default:
      return state;
  }
};
