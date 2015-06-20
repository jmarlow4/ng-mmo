angular.module('rl-app')
  .factory('SocketIO', function (socketFactory) {
    var socket = socketFactory();
    socket.forward('broadcast');
    return socket;
  });