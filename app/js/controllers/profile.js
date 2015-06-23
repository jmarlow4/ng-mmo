angular.module('rl-app')
  .controller('ProfileCtrl', function ($scope, Auth, $location, game) {
    $scope.logout = function() {
      Auth.logout(function(err) {
        if(!err) {
          $location.path('/');
          game.reset();
        }
      });
    };
  });