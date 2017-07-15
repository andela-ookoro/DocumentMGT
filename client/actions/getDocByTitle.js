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


const getDocByTitle = (title, owner) =>
  axios.get(
    `/api/v1/search/documents?`
  )
  .then(response =>
    getDocStatus('success', response.data.data, '')
  )
  .catch((error) => {
    if (error.response) {
      return sendMessage('getDocuments', error.response.data.message);
    }
  });

export default getDocByTitle;

