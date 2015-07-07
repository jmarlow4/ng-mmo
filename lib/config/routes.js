var path = require('path'),
  auth = require('../config/auth'),
  express = require('express'),
  router = express.Router();

module.exports = function() {

  // User Routes
  var users = require('../controllers/users');
  router.post('/auth/users', users.create);
  router.get('/auth/users/:userId', users.show);
  router.put('/auth/users/:userId', users.update);

  // Check if username is available
  router.get('/auth/check_username/:username', users.exists);

  // Session Routes
  var session = require('../controllers/session');
  router.get('/auth/session', auth.ensureAuthenticated, session.session);
  router.post('/auth/session', session.login);
  router.delete('/auth/session', session.logout);

  // Angular Routes
  router.get('/partials/*', function(req, res) {
    var requestedView = path.join('./', req.url);
    res.render(requestedView);
  });

  router.get('/*', function(req, res) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }

    res.render('../index.html');
  });

  return router;
}