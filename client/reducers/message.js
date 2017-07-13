import * as types from '../actions/actionTypes';

export default (state = { info: '', from: '' }, action) => {
  switch (action.type) {
    case types.MESSAGE:
      // check if user account is block
      if (action.message === 'This account is blocked, Please account admin') {
        // logout user
        localStorage.removeItem('userInfo');
        localStorage.removeItem('jwt');
        window.location = '/#/';
      }
      return action.message;
    default:
      return state;
  }
};
