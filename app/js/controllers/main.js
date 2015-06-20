angular.module('rl-app')
  .controller('MainCtrl', function ($scope, $rootScope) {

    $rootScope.showGame = true;

    $scope.$on('$destroy', function() {
      $rootScope.showGame = false;
    });
  });
