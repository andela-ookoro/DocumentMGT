import { HashRouter } from 'react-router-dom';
import axios from 'axios';

import * as types from './actionTypes';  
import sessionApi from '../apiRequest/SessionApi';

export const loginSuccess = () => {  
  return {type: types.LOG_IN_SUCCESS}
}

export const loginFailed = (loginMessage) => {
  return {
    type: types.LOG_FAILED,
    loginMessage: loginMessage
  }
}

export const logInUser = (credentials) => {
  return (dispatch) => {
    return axios.post('/users/login', credentials)
    .then(response => {
      localStorage.setItem('jwt', JSON.stringify(response.data.jwtToken));
      localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
      dispatch(loginSuccess());
    })
    .catch(error => {
      // check for errors from server
      if (error.response){
        dispatch(loginFailed(error.response.data.message));
      }
    });
  }
}


