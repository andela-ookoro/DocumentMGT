import axios from 'axios';
import * as types from './actionTypes';
import sendMessage from './message';

const sendReponse = (status, document = {}, message = '') => (
  {
    type: types.GET_DOCUMENT,
    status,
    document,
    message
  }
);


const getDocument = documentId =>
  axios.get(`/documents/${documentId}`)
  .then(response =>
      sendReponse('success', response.data.data, '')
  )
  .catch((error) => {
    if (error.response) {
      const message = error.response.data.message || error.response;
      return sendMessage('getDocuments', message);
    }
  });

export default getDocument;

