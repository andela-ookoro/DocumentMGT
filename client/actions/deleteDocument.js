import axios from 'axios';
import sendMessage from './message';

/**
 * - delete document by id
 * @param {int} documentId -  the id of the document
 * @return {null} - sendReponse
 */
const successMessage = 'Document has been deleted successfully';
const deleteDocument = documentId =>
  axios.delete(`/api/v1/documents/${documentId}`)
  .then(() => sendMessage('deleteDocument', successMessage))
  .catch((error) => {
    let message = 'An internal error occurred, please try again';
    if (error.response.status !== 500) {
      message = error.response.data.message;
    }
    return sendMessage('deleteDocument', message);
  });

export default deleteDocument;
