var app = angular.module('rl-app', ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'js/game/gameView.html',
      controller: 'gameCtrl'
    })
});