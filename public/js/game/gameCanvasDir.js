var app = angular.module('rl-app');

app.directive('gameCanvasDir', function(){
  return {
    template: '<div id="game-canvas">Canvas goes here</div>',
    controller: function($scope) {

    },
  }
});