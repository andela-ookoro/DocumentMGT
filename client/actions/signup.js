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
    if (error.response) {
      return sendMessage('signup', error.response.data.message);
    }
  });


