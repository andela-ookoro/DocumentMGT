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
      let message = 'An internal error occurred, please try again';
      if (error.response.status !== 500) {
        message = error.response.data.message;
      }
      return sendMessage('upsertDocument', message);
    });
};



