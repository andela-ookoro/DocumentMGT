import { combineReducers } from 'redux';
import message from './message';
import session from './session';
import SignupMessage from './signup';
import roles from './role';
import createDocStatus from './createDoc';
import Documents from './documents';
import deleteDocument from './deleteDocument';
import document from './getDocument';
/**
 * contains every reducers
 */
export default combineReducers({
  message,
  session,
  SignupMessage,
  roles,
  createDocStatus,
  Documents,
  deleteDocument,
  document
});
