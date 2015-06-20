var app = angular.module('rl-app');

app.directive('navDir', function(){
  return {
    templateUrl: '../views/partials/navbar.html',
    controller: 'navCtrl'
  }
});