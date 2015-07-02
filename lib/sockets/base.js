module.exports = function (io) {
  'use strict';

  var updateInterval = 100; // Broadcast updates every 100 ms.

  var users = {};

  // Set server-side game loop
  setInterval(broadcastingLoop, updateInterval);

  io.on('connection', function (socket) {
    socket.emit('broadcast', 'user connected');

    socket.on('join', function(charObj) {
      socket.character = charObj;
      users[charObj.name] = charObj;
      console.log(users);
      socket.broadcast.emit('transferPlayer', charObj);
    });

    socket.on('getOthers', function(){
      //console.log(users);
      socket.emit('giveOthers', users);
    });

    socket.on('message', function (from, msg) {
      io.sockets.emit('broadcast', {
        payload: msg,
        source: from
      });
    });

    socket.on("movePlayer", onMovePlayer);

    socket.on('disconnect', function() {
      var char = socket.character;
      console.log(socket.character.name + ' disconnected!');
      delete users[char.name];
      socket.broadcast.emit('userDisconnected', char);
      console.log(users);
    });

  });

  function onMovePlayer(data) {

    var char = this.character;
    var movingPlayer = users[char.name];

    //Moving player can be null if a player is killed and leftover movement signals come through.
    if (!users[char.name]) {
      return;
    }

    users[char.name].x = data.x;
    users[char.name].y = data.y;
    users[char.name].facing = data.facing;
    users[char.name].hasMoved = true;
  };

  function broadcastingLoop() {
    for(var i in users) {
      var player = users[i];
      if(player.hasMoved) {
        io.sockets.emit("playerMoved", {
          name: player.name,
          x: player.x,
          y: player.y,
          facing: player.facing
        });
        player.hasMoved = false;
      }
    }
  };

};