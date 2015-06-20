var app = angular.module('rl-app', [
  'ngRoute',
  'ngResource',
  'btford.socket-io',
  'ngCookies',
  'ngSanitize',
  'ngDialog',
  'http-auth-interceptor',
  'ui.bootstrap'
]);

app.config(function($routeProvider, $locationProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'js/game/gameView.html',
      controller: 'gameCtrl'
    });
  $locationProvider.html5Mode(true);
});

app.run(function($rootScope, $location, authService) {

});