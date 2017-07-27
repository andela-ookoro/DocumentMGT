import { DELETE_DOCUMENT } from '../actions/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case DELETE_DOCUMENT:
      return action;
    default:
      return state;
  }
};
