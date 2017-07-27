import { SIGN_UP_SUCCESS } from '../actions/actionTypes';
import initialState from './initialState';

export default (state = initialState.session, action) => {
  switch (action.type) {
    case SIGN_UP_SUCCESS:
      window.location = '/#/dashboard';
      return !!localStorage.jwt;
    default:
      return state;
  }
};
