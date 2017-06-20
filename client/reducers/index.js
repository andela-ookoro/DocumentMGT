import { combineReducers } from 'redux';
import users from './user';

/**
 * contains every reducers
 */
export default combineReducers({
  users: users,
  // More reducers if there are
  // can go here
});