import * as types from '../actions/actionTypes';
import sendMessage from '../actions/message';

export default (state = {}, action) => {
  switch (action.type) {
    case types.GET_USERS:
      // reset message action
      sendMessage('', '');
      return action;
    default:
      return state;
  }
};
