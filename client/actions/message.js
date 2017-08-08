import { MESSAGE } from './actionTypes';

const sendMessage = (from, info) => (
  {
    type: MESSAGE,
    message: {
      from,
      info,
      dateSent: new Date().valueOf()
    }
  }
);
export default sendMessage;
