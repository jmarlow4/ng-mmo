var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
};

module.exports = function(passport){

  /* GET login page. */
  router.get('/', isAuthenticated, function(req, res) {
    // Display the Login page with any flash message, if any
    res.sendFile('index.html', { user: req.user });
  });

  /* Handle Login POST */
  router.post('/auth/login', passport.authenticate('login', {
    //successRedirect: '/home',
    //failureRedirect: '/',
    failureFlash : true
  }));

  /* GET Registration Page */
  //router.get('/signup', function(req, res){
  //  res.sendFile('register.html');
  //});

  /* Handle Registration POST */
  router.post('/auth/signup', passport.authenticate('signup', {
    //successRedirect: '/home',
    //failureRedirect: '/signup',
    failureFlash : true
  }));

  /* GET Home Page */
  //router.get('/home', isAuthenticated, function(req, res){
  //  res.sendFile('home.html', { user: req.user });
  //});

  /* Handle Logout */
  router.get('/auth/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
};





