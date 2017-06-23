import * as types from './actionTypes';  
import sessionApi from '../apiRequest/SessionApi';
import axios from 'axios';

/**
 * @return {obj} - action type and a list of roles
 * @param {*} roles - list of role
 */
export const sendRoles = (roles) => {
  return {
    type: types.ROLES_LOADED,
    roles
  }
}

export const getRoleFailed = (roleLooadError) => {
  return {
    type: types.ROLES_LOAD_FAILED,
    roleLooadError
  }
}


export const getRoles = () => {
  return (dispatch) => {
    return axios.get('/roles')
    .then(response => {
      if (response.data.status === 'success') {
        dispatch(sendRoles(response.data.data));
      }
    })
    .catch(error => {
      if(error.response) {
        dispatch(getRoleFailed(error.response.data.message));
      }
    });
  }
}

