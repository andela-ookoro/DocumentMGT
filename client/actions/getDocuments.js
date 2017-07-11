import axios from 'axios';
import * as types from './actionTypes';
import sendMessage from './message';

const getDocStatus = (status, documents = []) => (
  {
    type: types.GET_DOCUMENTS,
    status,
    documents: documents.rows || [],
    pageCount: documents.count || 0,
  }
);


const getDocuments = (accessRight = '', title = '', offset = 0, limit = 7) =>
  axios.get(
    `/search/documents?accessRight=${accessRight}&title=${title}&offset=${offset}&limit=${limit}`
  )
  .then(response =>
    getDocStatus('success', response.data.data, '')
  )
  .catch((error) => {
    if (error.response) {
      return sendMessage('getDoucments', error.response.data.message);
    }
  });

export default getDocuments;

