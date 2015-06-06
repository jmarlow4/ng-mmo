var app = require('./app');
//var debug = require('debug')('roguelands:server');
var http = require('http');

var port = process.env.PORT || '8000';
app.set('port', port);

var server = http.createServer(app);

server.listen(port);