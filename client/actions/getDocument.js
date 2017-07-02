import axios from 'axios';
import * as types from './actionTypes';  

const sendReponse = ( status, document = {}, message = '') => {
  return {
    type: types.GET_DOCUMENT,
    status,
    document,
    message
 }
};


const getDocument = (documentId) => {
  return axios.get(`/documents/${documentId}`)
  .then(response => 
      sendReponse('success', response.data.data, '')
  )
  .catch(error => {
    if (error.response) {
      return sendReponse('failed', {}, error.response);
    }
  });
}

export default getDocument;

