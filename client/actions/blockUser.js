import axios from 'axios';
import sendMessage from './message';

/**
 * - delete document by id
 * @param {int} documentId -  the id of the document
 * @return {null} - sendReponse
 */
const successMessage = 'User has been blocked successfully';
const blockUser = userId =>
  axios.delete(`/api/v1/users/${userId}`)
  .then(response => sendMessage('blockUser', successMessage))
  .catch((error) => {
    let message = 'An internal error occurred, please try again';
    if (error.response.status !== 500) {
      message = error.response.data.message;
    }
    return sendMessage('blockUser', message);
  });

export default blockUser;





