import axios from 'axios';
import { GET_DOCUMENT } from './actionTypes';
import sendMessage from './message';

const sendReponse = (status, document = {}) => (
  {
    type: GET_DOCUMENT,
    status,
    document
  }
);


const getDocument = documentId =>
  axios.get(`/api/v1/documents/${documentId}`)
  .then(response =>
      sendReponse('success', response.data.document)
  )
  .catch((error) => {
    let message = 'An internal error occurred, please try again';
    if (error.response.status !== 500) {
      message = error.response.data.message;
    }
    return sendMessage('getDocument', message);
  });

export default getDocument;

