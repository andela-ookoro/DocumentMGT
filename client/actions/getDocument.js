import axios from 'axios';
import addJWT from './addJWT';

const sendReponse = ( status, document = {}, message = '') => {
  return {
    status,
    document,
    message
 }
};


const getDocument = (documentId) => {
  // add JWT token to axios
  addJWT();
  return axios.get(`/documents/${documentId}`)
  .then(response => {
     return sendReponse('success', response, '');
  })
  .catch(error => {
    console.log('error', error);
    if (error.response) {
      return sendReponse('failed', {}, error.response);
    }
  });
} 

export default getDocument;

