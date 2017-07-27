import { LOG_IN_SUCCESS } from '../actions/actionTypes';
import initialState from './initialState';

export default (state = initialState.session, action) => {
  switch (action.type) {
    case LOG_IN_SUCCESS:
      window.location = '/#/dashboard';
      return !!localStorage.jwt;
    default:
      return state;
  }
};
