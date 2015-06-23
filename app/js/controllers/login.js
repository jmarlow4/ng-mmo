angular.module('rl-app')
  .controller('LoginCtrl', function ($scope, Auth, $location) {
    $scope.error = {};
    $scope.user = {};

    $scope.registering = false;
    $scope.action = "Log In";
    $scope.toggle = "Register";
    $scope.toggleLogin = function () {
      $scope.registering = !$scope.registering;
      var tempSwap = $scope.action;
      $scope.action = $scope.toggle;
      $scope.toggle = tempSwap;
    };

    $scope.login = function(form) {
      $scope.closeThisDialog();
      Auth.login('password', {
          'email': $scope.user.email,
          'password': $scope.user.password
        },
        function(err) {
          $scope.errors = {};

          if (!err) {
            $location.path('/');
            //console.log($rootScope.currentUser)
          } else {
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.type;
            });
            $scope.error.other = err.message;
          }
      });
    };

    $scope.register = function(form) {
      $scope.closeThisDialog();
      Auth.createUser({
          email: $scope.user.email,
          username: $scope.user.username,
          password: $scope.user.password,
        },
        function(err) {
          $scope.errors = {};

          if (!err) {
            $location.path('/');
          } else {
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.type;
            });
          }
        }
      );
    };
  });