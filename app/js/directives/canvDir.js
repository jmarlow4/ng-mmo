angular.module('rl-app')
  .directive('gameCanvasDir', function(){
  return {
    template: '<div id="game"></div>',
    controller: function($scope, game) {
      //start game
      game.start();
    }
  }
});