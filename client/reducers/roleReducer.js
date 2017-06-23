import * as types from '../actions/actionTypes'; 

export default (state = [], action) => {
  switch (action.type){
    case types.ROLES_LOADED:
    const test =  [
      ...state,
      ...action.roles
    ];
    return test
    default:
       return state;
  }
};