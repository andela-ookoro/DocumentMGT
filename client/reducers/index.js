import { combineReducers } from 'redux';
import message from './message';
import session from './session';
import SignupMessage from './signup';
import roles from './role';
import createDocStatus from './createDoc';
import Documents from './getDocuments';
import deleteDocument from './deleteDocument';
import document from './getDocument';
import Users from './getUsers';
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
  document,
  Users
});
