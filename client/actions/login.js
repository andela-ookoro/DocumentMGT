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
    // check for errors from server
    if (error.response) {
      return sendMessage('login', error.response.data.message);
    }
  });
