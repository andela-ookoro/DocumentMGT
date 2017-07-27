import { ROLES } from '../actions/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case ROLES:
      return action.roles;
    default:
      return state;
  }
};
