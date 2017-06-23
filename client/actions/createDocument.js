import axios from 'axios';

export const createDocStatus = ( status, message ) => (
  {
    status,
    message
 }
);


export const createDocument = (document) => {
    const jwt = JSON.parse(localStorage.getItem('jwt'));
    const config = {
        headers: { 'Authorization':  jwt }
    };
   return axios.post('/documents', document, config)
    .then(response => {
      return createDocStatus('success', document.title);
    })
    .catch(error => {
      if (error.response) {
        return createDocStatus('failed', error.response.data.message);
      }
    });
}


