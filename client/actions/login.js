import axios from 'axios';
import { LOG_IN_SUCCESS } from './actionTypes';
import sendMessage from './message';

export const loginSuccess = () => (
  {
    type: LOG_IN_SUCCESS
  }
);


export const logIn = credentials =>
 axios.post('/api/v1/users/login', credentials)
  .then((response) => {
    localStorage.setItem('jwt', JSON.stringify(response.data.jwtToken));
    localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
    return loginSuccess();
  })
  .catch((error) => {
    let message = 'An internal error occurred, please try again';
    if (error.response.status !== 500) {
      message = error.response.data.message;
    }
    return sendMessage('login', message);
  });
