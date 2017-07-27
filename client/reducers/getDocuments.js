import { GET_DOCUMENTS } from '../actions/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_DOCUMENTS:
      return action;
    default:
      return state;
  }
};
