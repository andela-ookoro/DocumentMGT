import axios from 'axios';
import addJWT from './addJWT';

export const createDocStatus = ( status, message ) => (
  {
    status,
    message
 }
);


export const upsertDocument = (document, docId) => {
  let url = '/documents';
  let apiRequest;
  // check docId is 0, then it is an insert; else it is an update
  if (docId === 0) {
    apiRequest = axios.post(url, document);
  } else {
    url = `${url}/${docId}`;
    apiRequest = axios.put(url, document);
  }
  addJWT();

  return apiRequest
  .then(response => {
    return createDocStatus('success', document.title);
  })
  .catch(error => {
    if (error.response) {
      return createDocStatus('failed', error.response.data.message);
    }
  });
}


