var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io')(server);

server.listen(8000);