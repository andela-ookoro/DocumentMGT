import * as types from '../actions/actionTypes'; 

const createDocReducer = (state = '', action ) => {  
  switch(action.type) {
    case types.CREATE_DOCUMENT_STATUS:
      return { status: action.status, title: action.title}
    default:
      return state;
  }
}
export default  createDocReducer;


