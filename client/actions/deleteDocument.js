import axios from 'axios';
import * as types from './actionTypes';

const sendReponse = (status, document = {}, message = '') => {
  return {
    type: types.DELETE_DOCUMENT,
    status,
    document,
    message
 }
};

/**
 * - delete document by id
 * @param {int} documentId -  the id of the document
 */
const deleteDocument = (documentId) => {
  return axios.delete(`/documents/${documentId}u`)
  .then(response => {
     return sendReponse('success', response, '');
  })
  .catch(error => {
    if (error.response) {
      return sendReponse('failed', {}, error.response.data.message);
    }
  });
} 

export default deleteDocument;





