import axios from 'axios';
import * as types from './actionTypes';

export const createDocStatus = (status, message) => (
  {
    type: types.CREATE_DOCUMENT_STATUS,
    status,
    message
  }
);


export const upsertDocument = (document, docId = 0) => {
  let url = '/documents';
  let apiRequest;
  // check docId is 0, then it is an insert; else it is an update
  if (docId === 0) {
    apiRequest = axios.post(url, document);
  } else {
    url = `${url}/${docId}`;
    apiRequest = axios.put(url, document);
  }
  return apiRequest
    .then(response =>
      createDocStatus('success', document.title)
    )
    .catch(error => {
      if (error.response) {
        return createDocStatus('failed', error.response.data.message);
      }
    });
};



