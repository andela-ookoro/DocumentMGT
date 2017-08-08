import axios from 'axios';
import * as types from './actionTypes';
import sendMessage from './message';

export const signupSuccess = () => (
  {
    type: types.SIGN_UP_SUCCESS
  }
);

export const signup = credentials =>
  axios.post('/api/v1/users', credentials)
  .then((response) => {
    localStorage.setItem('jwt', JSON.stringify(response.data.jwtToken));
    localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
    return signupSuccess();
  })
  .catch((error) => {
    let message = 'An internal error occurred, please try again';
    if (error.response.status !== 500) {
      message = error.response.data.message;
    }
    return sendMessage('signup', message);
  });
