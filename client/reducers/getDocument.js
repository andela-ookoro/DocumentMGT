import { GET_DOCUMENT } from '../actions/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_DOCUMENT:
      return action;
    default:
      return state;
  }
};
