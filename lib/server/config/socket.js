'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var socketThings = function socketThings(server) {
  // connect socket to the server
  var appSocket = (0, _socket2.default)(server);
  appSocket.on('connection', function (socket) {
    // respond to document update
    socket.on('documentUpdate', function (documentID) {
      socket.emit('ReloadDocument', { documentID: documentID });
    });

    // when use join room
    socket.on('room', function (data) {
      socket.join(data.room);
    });

    // when a document is updated
    socket.on('coding event', function (data) {
      socket.broadcast.to(data.room).emit('receive code', data);
    });

    // when users leave a room
    socket.on('leave room', function (data) {
      socket.leave(data.room);
    });
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });
}; // integrate socket 
exports.default = socketThings;