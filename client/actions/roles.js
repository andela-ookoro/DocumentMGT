import axios from 'axios';
import * as types from './actionTypes';
import sendMessage from './message';

export const sendRoles = (roles) => {
  return {
    type: types.ROLES_LOADED,
    roles
  };
};

/**
 * @return {obj} - action type and a list of roles
 * @param {*} roles - list of role
 */
export const getRoles = () =>
  axios.get('/api/v1/roles')
  .then(response => {
    if (response.data.status === 'success') {
      return sendRoles(response.data.roles);
    }
  })
  .catch(error => {
    let message = 'An internal error occurred, please try again';
    if (error.response.status !== 500) {
      message = error.response.data.message;
    }
    return sendMessage('restoreUser', message);
  });

