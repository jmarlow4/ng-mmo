var app = angular.module('rl-app');

app.directive('navDir', function(){
  return {
    templateUrl: 'js/navbar/navView.html',
    controller: function($scope, navService, ngDialog) {

      $scope.openLogin = function() {
        ngDialog.open({
          template: 'js/login/loginTmpl.html',
          controller: 'loginCtrl',
          class: 'ngdialog-theme-default'
        });
      }
    }
  }
});