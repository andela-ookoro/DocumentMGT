import * as types from '../actions/actionTypes';

export default (state = { info: '', from: '' }, action) => {
  switch (action.type) {
    case types.MESSAGE:
      let message = action.message;
      // check if user account is block
      if (message.info === 'This account is blocked, Please contact the admin') {
        // logout user
        localStorage.removeItem('userInfo');
        localStorage.removeItem('jwt');
        window.location = '/#/';
        return {
          info: message.info,
          from: 'login'
        }
      } else if (!message.from) {
        message = {
          from: 'reset',
          info: 'reset'
        }
      }
      return message;
    default:
      return state;
  }
};
