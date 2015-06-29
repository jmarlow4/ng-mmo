module.exports = function (io) {
  'use strict';

  var users = [];

  io.on('connection', function (socket) {
    socket.emit('broadcast', 'user connected');

    socket.on('join', function(charObj) {
      socket.character = charObj;
      users.push(charObj);
      console.log(users);
      socket.broadcast.emit('transferPlayer', charObj);
    });

    socket.on('getOthers', function(){
      //console.log(users);
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
      var char = socket.character;
      console.log(socket.character.name + ' disconnected!');
      users.splice(users[users.indexOf(char)], 1);
      socket.broadcast.emit('userDisconnected', char);
      console.log(users);
    });

  });

};