var app = angular.module('rl-app');

app.factory('userService', function($resource) {
  return $resource('/auth/users/:id/', {},
    {
      'update': {
        method:'PUT'
      }
    });
});