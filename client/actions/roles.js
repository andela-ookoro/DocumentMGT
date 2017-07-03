import axios from 'axios';
import * as types from './actionTypes';


export const sendRoles = (roles) => {
  return {
    type: types.ROLES_LOADED,
    roles
  };
};

export const getRoleFailed = (roleLooadError) => {
  return {
    type: types.ROLES_LOAD_FAILED,
    roleLooadError
  };
};

/**
 * @return {obj} - action type and a list of roles
 * @param {*} roles - list of role
 */
export const getRoles = () =>
  axios.get('/roles')
  .then(response => {
    if (response.data.status === 'success') {
      return sendRoles(response.data.data);
    }
  })
  .catch(error => {
    if (error.response) {
      return getRoleFailed(error.response.data.message);
    }
  });

