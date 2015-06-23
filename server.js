var express = require('express'),
  io = require('socket.io'),
  app = express(),
  http = require('http'),
  passport = require('passport'),
  path = require('path'),
  fs = require('fs'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  session = require('express-session'),
  mongoStore = require('connect-mongo')(session),
  config = require('./lib/config/config');

// Connect to database
var db = require('./lib/db/mongo').db;

//Set up sockets


// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});

var pass = require('./lib/config/pass');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(logger('dev'));

app.use(favicon(__dirname + '/app/favicon.ico'));
//app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }) );
app.use(cookieParser());
//app.use(methodOverride());
app.use(express.static(path.join(__dirname + '/app')));
app.set('views', (path.join(__dirname + '/app/views')));
//app.use(express.static(path.join(__dirname, '/app')));

var expressSession = require('express-session');
app.use(expressSession({
  secret: 'mySecretKey',
  resave: true,
  saveUninitialized: true,
  store: new mongoStore({
    url: config.db,
    collection: 'sessions'
  })
}));

// use passport session
app.use(passport.initialize());
app.use(passport.session());

//Bootstrap routes
var routes = require('./lib/config/routes')();
app.use('/', routes);

//var debug = require('debug')('roguelands:server');

var port = process.env.PORT || 8000;
app.set('port', port);

var server = http.createServer(app);
io = io.listen(server);
require('./lib/sockets/base')(io);

server.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});