var app = angular.module('rl-app');

app.controller('loginCtrl', function ($scope, authService) {

  $scope.registering = false;

  $scope.action = "Log In";

  $scope.toggle = "Register";

  $scope.toggleLogin = function () {
    $scope.registering = !$scope.registering;
    var tempSwap = $scope.action;
    $scope.action = $scope.toggle;
    $scope.toggle = tempSwap;
  };

  $scope.clickedSubmit = function () {
    if ($scope.action = "Log In") {
      authService.login();
    }
    else if ($scope.action = "Register") {
      authService.register();
    }
  };
});