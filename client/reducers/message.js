import { MESSAGE } from '../actions/actionTypes';

export default (state = { info: '', from: '' }, action) => {
  let message = action.message;
  switch (action.type) {
    case MESSAGE:
      // check if user account is block
      if (message.info === 'This account is blocked, Please contact the admin') {
        // logout user
        localStorage.removeItem('userInfo');
        localStorage.removeItem('jwt');
        window.location = '/#/';
        return {
          info: message.info,
          from: 'login'
        };
      } else if (!message.from) {
        message = {
          from: 'reset',
          info: 'reset'
        };
      }
      return message;
    default:
      return state;
  }
};
