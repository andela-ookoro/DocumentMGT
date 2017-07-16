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
  axios.get(`/api/v1/documents/${documentId}`)
  .then(response =>
      sendReponse('success', response.data.data, '')
  )
  .catch((error) => {
    // if (error.response) {
    //   const message = error.response.data.message || error.response;
    //   return sendMessage('getDocument', message);
    // }
    let message = 'An internal error occurred, please try again';
    if (error.response.status !== 500) {
      message = error.response.data.message;
    }
    return sendMessage('getDocument', message);
  });

export default getDocument;

