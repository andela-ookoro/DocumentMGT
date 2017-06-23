import { combineReducers } from 'redux';
import loginMessage from './loginReducer';
import session from './sessionReducer';
import SignupMessage from './signupReducer';
import roles from './roleReducer';

/**
 * contains every reducers
 */
export default combineReducers({
  loginMessage,
  session,
  SignupMessage,
  roles
});