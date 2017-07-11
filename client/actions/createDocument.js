import axios from 'axios';
import sendMessage from './message';
import socketIO from 'socket.io';

export default (document, docId = 0) => {
  let url = '/documents';
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
    .then(() => {
      const socket = socketIO('http://localhost:1142');
      socket.emit('documentUpdate', { documentID: document.id });
      return sendMessage('upsertDocument', successMessage);
    })
    .catch((error) => {
      if (error.response) {
        const message = error.response.data.message || error.response;
        return sendMessage('upsertDocument', message);
      }
    });
};



