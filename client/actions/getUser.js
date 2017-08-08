import axios from 'axios';
import { GET_USER } from './actionTypes';
import sendMessage from './message';

const sendReponse = (status, user = {}) => (
  {
    type: GET_USER,
    status,
    user
  }
);

const getUser = userId =>
  axios.get(`/api/v1/users/${userId}`)
  .then(response =>
    sendReponse('success', response.data.user)
  )
  .catch((error) => {
    let message = 'An internal error occurred, please try again';
    if (error.response.status !== 500) {
      message = error.response.data.message;
    }
    return sendMessage('getUser', message);
  });

export default getUser;

