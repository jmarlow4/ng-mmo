angular.module('rl-app')
  .factory('User', function ($resource) {
    return $resource('/auth/users/:id/', {id:'@_id'} , {
      update: {method: 'PUT'}
    });
  });
