import * as types from '../actions/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case types.ROLES_LOADED:
      return action.roles;
    default:
      return state;
  }
};
