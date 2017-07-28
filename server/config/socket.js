// integrate socket 
import socketIO from 'socket.io';

const socketThings = (server) => {
  // connect socket to the server
  const appSocket = socketIO(server);
  appSocket.on('connection', (socket) => {
    // respond to document update
    socket.on('documentUpdate', (documentID) => {
      socket.emit('ReloadDocument', { documentID });
    });

    // when use join room
    socket.on('room', (data) => {
      socket.join(data.room);
    });

    // when a document is updated
    socket.on('coding event', (data) => {
      socket.broadcast
      .to(data.room)
      .emit('receive code',data);
    });

    // when users leave a room
    socket.on('leave room', (data) => {
      socket.leave(data.room)
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};

export default socketThings;
