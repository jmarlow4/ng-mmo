var app = angular.module('rl-app');

app.directive('navDir', function(){
  return {
    templateUrl: 'js/navbar/navView.html',
    controller: function($scope, navService) {
      navService.getFriends();
    }
  }
});