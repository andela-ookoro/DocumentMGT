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
    let message = 'An internal error occurred, please try again';
    if (error.response.status !== 500) {
      message = error.response.data.message;
    }
    return sendMessage('getDocuments', message);
  });

export default getDocByTitle;

