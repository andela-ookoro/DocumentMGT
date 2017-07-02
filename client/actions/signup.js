import * as types from './actionTypes';
import axios from 'axios';

export const signupSuccess = () => {  
  return {type: types.SIGNUP_IN_SUCCESS}
}

export const signupFailed = (signupMessage) => {
  return {
    type: types.SIGNUP_FAILED,
    signupMessage
  }
}

export const signup = (credentials) => {
  return axios.post('/users', credentials)
  .then(response => {
    localStorage.setItem('jwt', JSON.stringify(response.data.jwtToken));
    localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
    return signupSuccess();
  })
  .catch(error => {
    if (error.response) {
     return signupFailed(error.response.data.message);
    }
  });
}


