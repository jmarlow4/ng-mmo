angular.module('rl-app')
  .controller('navCtrl', function ($scope, Auth, $location, ngDialog) {

    $scope.openLogin = function() {
      ngDialog.open({
        template: 'views/partials/login.html',
        controller: 'LoginCtrl',
        class: 'ngdialog-theme-default'
      });
    }
  });
