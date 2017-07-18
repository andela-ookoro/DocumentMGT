import axios from 'axios';
import sendMessage from './message';

/**
 * - restore document by id
 * @param {int} documentId -  the id of the document
 * @return {null} - sendReponse
 */
const successMessage = 'User has been restored successfully';
const restoreUser = userId =>
  axios.post(`/api/v1/users/restore/${userId}`, {status: 'active'})
  .then(() => sendMessage('restoreUser', successMessage))
  .catch((error) => {
    let message = 'An internal error occurred, please try again';
    if (error.response.status !== 500) {
      message = error.response.data.message;
    }
    return sendMessage('restoreUser', message);
  });

export default restoreUser;