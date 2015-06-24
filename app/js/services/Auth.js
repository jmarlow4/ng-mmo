angular.module('rl-app')
  .factory('Auth', function Auth(
    $location, $rootScope, $routeParams, Session, User, $cookieStore) {

    $rootScope.currentUser = $cookieStore.get('user') || null;
    //$cookieStore.remove('user');

    return {

      login: function(provider, user, callback) {
        var cb = callback || angular.noop;
        Session.save({
          provider: provider,
          email: user.email,
          password: user.password,
          rememberMe: user.rememberMe
        }, function(user) {
          $rootScope.currentUser = user;
          return cb();
        }, function(err) {
          return cb(err.data);
        });
      },

      logout: function(callback) {
        var cb = callback || angular.noop;
        Session.delete(function(res) {
            $rootScope.currentUser = null;
            $cookieStore.remove('user');
            return cb();
          },
          function(err) {
            return cb(err.data);
          });
      },

      createUser: function(userinfo, callback) {
        var cb = callback || angular.noop;
        User.save(userinfo,
          function(user) {
            $rootScope.currentUser = user;
            return cb();
          },
          function(err) {
            return cb(err.data);
          });
      },

      currentUser: function() {
        Session.get(function(user) {
          $rootScope.currentUser = user;
        });
      },

      saveCharacters: function(charArray, callback) {
        var cb = callback || angular.noop;
        User.update({
          characters: charArray
        }, function(user) {
          console.log('characters saved');
          return cb();
        }, function(err) {
          return cb(err.data);
        });
      },

      changePassword: function(email, oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;
        User.update({
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
            console.log('password changed');
            return cb();
        }, function(err) {
            return cb(err.data);
        });
      },

      removeUser: function(email, password, callback) {
        var cb = callback || angular.noop;
        User.delete({
          email: email,
          password: password
        }, function(user) {
            console.log(user + 'removed');
            return cb();
        }, function(err) {
            return cb(err.data);
        });
      }
    };
  })