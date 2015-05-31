var express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io')(server);

var port = process.env.PORT || 8000;
var staticPath = path.join(__dirname, '../client');

app.use(express.static(staticPath, { maxAge: 86400000 }));

app.get('/', function(req, res) {
  res.sendFile(path.join(staticPath, 'index.html'));
});

server.listen(port, function() {
  console.log('Server running on on PORT: ' + port);
});