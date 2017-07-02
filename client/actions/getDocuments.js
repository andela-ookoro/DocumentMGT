import axios from 'axios';
import * as types from './actionTypes';

const getDocStatus = ( status, documents = [], message = '') => {
  return {
    type: types.GET_DOCUMENTS,
    status,
    documents: documents.rows  || [],
    pageCount: documents.count  || 0,
    message
 }
};


const getDocuments = (accessRight = '', title = '', offset: 0, limit: 7)  => {
  return axios.get(
    `/search/documents?accessRight=${accessRight}&title=${title}&offset=${offset}&limit=${limit}`
  )
  .then(response => 
    getDocStatus('success', response.data.data, '')
  )
  .catch(error => {
    if (error.response) {
      return getDocStatus('failed', [], error.response.data.message);
    }
  });
}

export default getDocuments;

