import axios from 'axios';
import * as types from './actionTypes';
import sendMessage from './message';

const sendReponse = (status, document = {}, message = '') => {
  return {
    type: types.DELETE_DOCUMENT,
    status,
    document,
    message
  };
};

/**
 * - delete document by id
 * @param {int} documentId -  the id of the document
 * @return {null} - sendReponse
 */
const successMessage = 'document has been deleted successfully';
const deleteDocument = documentId =>
  axios.delete(`/api/v1/documents/${documentId}`)
  .then(response => sendMessage('deleteDocument', successMessage))
  .catch((error) => {
    let message = 'An internal error occurred, please try again';
    if (error.response.status !== 500) {
      message = error.response.data.message;
    }
    return sendMessage('deleteDocument', message);
  });

export default deleteDocument;





