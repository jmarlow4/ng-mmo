var app = angular.module('rl-app');

app.directive('gameCanvasDir', function(){
  return {
    template: '<div id="game-canvas"></div>',
    controller: function($scope) {

    },
  }
});