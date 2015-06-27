module.exports = function (io) {
  'use strict';

  var users = [];

  io.on('connection', function (socket) {
    socket.emit('broadcast', 'user connected');

    socket.on('join', function(charObj) {
      //socket.character = charObj;
      users.push(charObj);
      //console.log(users);
      socket.broadcast.emit('transferPlayer', charObj);
    });

    socket.on('getOthers', function(){
      console.log(users);
      socket.emit('giveOthers', users);
    });

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

    socket.on('disconnect', function() {
      var i = users.indexOf(socket.character);
      console.log(users[i] + ' disconnected!');
      users.splice(users[i], 1);
      //console.log(users);
    });

  });

};