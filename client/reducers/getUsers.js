import { GET_USERS } from '../actions/actionTypes';
import sendMessage from '../actions/message';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_USERS:
      // reset message action
      sendMessage('', '');
      console.log('action oh', action);
      return action;
    default:
      return state;
  }
};