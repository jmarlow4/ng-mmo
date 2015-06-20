module.exports = function (io) {
  'use strict';

  var users = [];

  io.on('connection', function (socket) {
    socket.broadcast.emit('user connected');

    socket.on('message', function (from, msg) {

      console.log('recieved message from', from, 'msg', JSON.stringify(msg));

      console.log('broadcasting message');
      console.log('payload is', msg);
      io.sockets.emit('broadcast', {
        payload: msg,
        source: from
      });
      console.log('broadcast complete');
    });

    socket.on('join', function (user) {
      users.push(user);
      io.sockets.emit('broadcast', {payload: users});
    });
  });
};