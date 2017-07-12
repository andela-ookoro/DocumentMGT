import axios from 'axios';
import sendMessage from './message';

export default (document, docId = 0) => {
  let url = '/api/v1/documents';
  let apiRequest;
  let successMessage;
  // check docId is 0, then it is an insert; else it is an update
  if (docId === 0) {
    apiRequest = axios.post(url, document);
    successMessage = 'Document has been created successfully';
  } else {
    url = `${url}/${docId}`;
    apiRequest = axios.put(url, document);
    successMessage = 'Document has been updated successfully';
  }
  return apiRequest
    .then(() => sendMessage('upsertDocument', successMessage)
    )
    .catch((error) => {
      if (error.response) {
        const message = error.response.data.message || error.response;
        return sendMessage('upsertDocument', message);
      }
    });
};



