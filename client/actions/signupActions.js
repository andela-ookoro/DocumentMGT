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

export const signupUser = (credentials) => {
  return (dispacth) => {
    console.log('credentials', credentials);
    return axios.post('/users', credentials)
    .then(response => {
      localStorage.setItem('jwt', response.data.jwtToken);
      localStorage.setItem('userInfo', response.data.userInfo);
      dispacth(signupSuccess());
    })
    .catch(error => {
      if (error.response) {
        dispacth(signupFailed(error.response.data.message));
      }
    });
  }
}


