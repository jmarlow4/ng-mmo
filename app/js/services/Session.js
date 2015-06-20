angular.module('rl-app')
  .factory('Session', function ($resource) {
    return $resource('/auth/session/');
  });
