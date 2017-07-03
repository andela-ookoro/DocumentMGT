import axios from 'axios';
import * as types from './actionTypes';

export const loginSuccess = () => {  
  return {
    type: types.LOG_IN_SUCCESS
  };
};

export const loginFailed = (loginMessage) => {
  return {
    type: types.LOG_FAILED,
    loginMessage
  };
};

export const logIn = credentials =>
 axios.post('/users/login', credentials)
  .then(response => {
    localStorage.setItem('jwt', JSON.stringify(response.data.jwtToken));
    localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
    return loginSuccess();
  })
  .catch(error => {
    // check for errors from server
    if (error.response) {
      return loginFailed(error.response.data.message);
    }
  });


