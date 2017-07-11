import { MESSAGE } from './actionTypes';

const sendMessage = (from, info) => (
  {
    type: MESSAGE,
    message: {
      from,
      info
    }
  }
);
export default sendMessage;
