import axios from 'axios';
import { ROLES } from './actionTypes';
import sendMessage from './message';

export const sendRoles = roles => ({
  type: ROLES,
  roles
});

/**
 * @return {obj} - action type and a list of roles
 * @param {*} roles - list of role
 */
export const getRoles = () =>
  axios.get('/api/v1/roles')
  .then(response => sendRoles(response.data.roles))
  .catch((error) => {
    let message = 'An internal error occurred, please try again';
    if (error.response.status !== 500) {
      message = error.response.data.message;
    }
    return sendMessage('getRoles', message);
  });

