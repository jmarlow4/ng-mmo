angular.module('rl-app')
  .controller('ProfileCtrl', function ($scope, Auth, $location, $rootScope) {
    $scope.logout = function() {
      Auth.logout(function(err) {
        if(!err) {
          $location.path('/');
          console.log($rootScope.currentUser)
        }
      });
    };
  });