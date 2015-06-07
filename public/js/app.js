var app = angular.module('rl-app', ['ngRoute']);

app.config(function($routeProvider, $locationProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'js/game/gameView.html',
      controller: 'gameCtrl'
    })
  $locationProvider.html5Mode(true);
});