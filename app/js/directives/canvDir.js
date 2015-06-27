angular.module('rl-app')
  .directive('gameCanvasDir', function(){
  return {
    template: '<div id="game"></div>',
    controller: function($scope, game, $rootScope, $window, $location) {
      //start game
      game.start();
    }
  }
});